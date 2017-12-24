import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
  CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes
} from './utils';
import Router from 'koa-router';
import {getLogger} from './utils';
import {getDecodedTokenFromRequest} from './auth-router';

const log = getLogger('tag');

let tagsLastUpdateMillis = null;


export class TagRouter extends Router {
    constructor(props) {
        super(props);
        this.tagStore = props.tagStore;
        this.io = props.io;
        this.connections = props.connections;
        this.get('/', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);
            log(`decoded id ` + decoded._id);

            let res = ctx.response;
            let lastModifed = ctx.request.get(LAST_MODIFIED);
            if (lastModifed && tagsLastUpdateMillis && tagsLastUpdateMillis <= new Date(lastModifed).getTime()){
                log('search / - 304 Not Modified (the client can use the cached data)');
                res.status = NOT_MODIFIED;
            } else {
                res.body = await this.tagStore.find({user : decoded._id});
                if (!tagsLastUpdateMillis){
                    tagsLastUpdateMillis = Date.now();
                }
                res.set({[LAST_MODIFIED]: new Date(tagsLastUpdateMillis)});
                log('search / - 200 Ok');
            }
        }).get('/:id', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);
            let tag = await this.tagStore.findOne({_id: ctx.params.id, user: decoded._id});
            let res = ctx.response;
            if (tag) {
                log('read /:id - 200 Ok');
                this.setTagRes(res, OK, tag);
            } else {
                log('read /:id - 404 Not Found');
                setIssueRes(res, NOT_FOUND, [{warning: 'Tag not found'}]);
            }
        }).post('/', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);

            let tag = ctx.request.body;
            let res = ctx.response;

            tag.user = decoded._id;
            if (tag.name) {
                await this.createTag(res, tag, decoded.username);
            } else {
                log('create /- 400 Bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Name is missing'}]);
            }
        }).put('/:id', async(ctx) => {
            // get the new tag from body
            let tag = ctx.request.body;
            // id of the tag to update as parameter
            let id = ctx.params.id;
            // id of the new tag
            let tagId = tag._id;
            // extract response
            let res = ctx.response;
            // new tag and path id should be the same
            if (tagId && tagId != id){
                log('update /:id - 400 bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Param id and body id should be the same'}]);
                return;
            }
            // new tag should be valid
            if (!tag.name) {
                log('update /:id - 400 Bad Request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Name is missing'}]);
                return;
            }


            let persistedTag = await this.tagStore.findOne({_id: id});
            if (persistedTag) {
              let tagVersion = parseInt(ctx.request.get(ETAG)) || tag.version;
              if (!tagVersion) {
                  log(`update /:id - 400 Bad Request (no version specified)`);
                  setIssueRes(res, BAD_REQUEST, [{error: 'No version specified'}]); //400 Bad Request
                } else if (tagVersion < persistedTag.version) {
                    log(`update /:id - 409 Conflict`);
                    setIssueRes(res, CONFLICT, [{error: 'Version conflict'}]); //409 Conflict
                } else {
                    let decoded = getDecodedTokenFromRequest(ctx);
                    tag.user = decoded._id;
                    tag.version = parseInt(tagVersion) + 1;
                    tag.updated = Date.now();
                    let updatedCount = await this.tagStore.update({_id: id}, tag);
                    tagsLastUpdateMillis = tag.updated;
                    if (updatedCount == 1) {
                      this.setTagRes(res, OK, tag); //200 Ok
                      this.notifyClients(decoded.username, 'tag/updated', tag);
                    } else {
                      log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                      setIssueRes(res, METHOD_NOT_ALLOWED, [{error: 'Tag no longer exists'}]); //
                    }
                 }
            } else {
                log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                setIssueRes(res, METHOD_NOT_ALLOWED, [{error:'Tag no longer exists'}]);
            }

    }).del('/:id', async(ctx) => {
        let id = ctx.params.id;

        // find the requested tag
        let persistedTag = await this.tagStore.findOne({_id: id});

        if (persistedTag == null){
            setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Invalid id'}]);
            return;
        }

        // delete it
        await this.tagStore.remove({_id: id});
        this.io.emit('tag-deleted', persistedTag)
        tagsLastUpdateMillis = Date.now();

        this.setTagRes(ctx.response, OK, persistedTag);

        log(`remove /:id`);

        // notify clients of deletion
        let decoded = getDecodedTokenFromRequest(ctx);
        let username = decoded.username;
        this.notifyClients(username, 'tag/deleted', persistedTag);
    });
  }

  async createTag(res, tag, username){
      tag.version = 1;
      tag.updated = Date.now();
      let insertedTag = await this.tagStore.insert(tag);
      tagsLastUpdateMillis = tag.updated;
      this.setTagRes(res, CREATED, insertedTag);

      this.notifyClients(username, 'tag/created', insertedTag);
  }

  async notifyClients(username, event, tag){
      let clients = this.connections[username];
      if (clients != undefined){
          for (let client of clients){
              client.emit(event, tag);
          }
      }
  }

  setTagRes(res, status, tag){
      res.body = tag;
      res.set({
          [ETAG]: tag.version,
          [LAST_MODIFIED]: new Date(tag.updated)
      });
      res.status = status;
  }
}
