import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
  CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes
} from './utils';
import Router from 'koa-router';
import {getLogger} from './utils';

const log = getLogger('tag');

let tagsLastUpdateMillis = null;

export class TagRouter extends Router {
    constructor(props) {
        super(props);
        this.tagStore = props.tagStore;
        this.io = props.io;
        this.get('/', async(ctx) => {
            let res = ctx.response;
            let lastModifed = ctx.request.get(LAST_MODIFIED);
            if (lastModifed && tagsLastUpdateMillis && tagsLastUpdateMillis <= new Date(lastModifed).getTime()){
                log('search / - 304 Not Modified (the client can use the cached data)');
                res.status = NOT_MODIFIED;
            } else {
                res.body = await this.tagStore.find({});
                if (!tagsLastUpdateMillis){
                    tagsLastUpdateMillis = Date.now();
                }
                res.set({[LAST_MODIFIED]: new Date(tagsLastUpdateMillis)});
                log('search / - 200 Ok');
            }
        }).get('/:id', async(ctx) => {
            let tag = await this.tagStore.findOne({_id: ctx.params.id});
            let res = ctx.response;
            if (tag) {
                log('read /:id - 200 Ok');
                this.setTagRes(res, OK, tag);
            } else {
                log('read /:id - 404 Not Found');
                setIssueRes(res, NOT_FOUND, [{warning: 'Tag not found'}]);
            }
        }).post('/', async(ctx) => {
            let tag = ctx.request.body;
            let res = ctx.response;
            if (tag.name) {
                await this.createTag(res, tag);
            } else {
                log('create /- 400 Bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Name is missing'}]);
            }
        }).put('/:id', async(ctx) => {
            let tag = ctx.request.body;
            let id = ctx.params.id;
            let tagId = tag._id;
            let res = ctx.response;
            if (tagId && tagId != id){
                log('update /:id - 400 bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Param id and body id should be the same'}]);
                return;
            }
            if (!tag.name) {
                log('update /:id - 400 Bad Request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Name is missing'}]);
                return;
            }
            if (!tagId){
                await this.createTag(res, tag);
            } else {
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
                        tag.version = tagVersion + 1;
                        tag.updated = Date.now();
                        let updatedCount = await this.tagStore.update({_id: id}, tag);
                        tagsLastUpdateMillis = tag.updated;
                        if (updatedCount == 1) {
                          this.setTagRes(res, OK, tag); //200 Ok
                          this.io.emit('tag-updated', tag);
                        } else {
                          log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                          setIssueRes(res, METHOD_NOT_ALLOWED, [{error: 'Tag no longer exists'}]); //
                        }
                     }
                } else {
                    log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                    setIssueRes(res, METHOD_NOT_ALLOWED, [{error:'Tag no longer exists'}]);
                }
            }
    }).del('/:id', async(ctx) => {
        let id = ctx.params.id;
        await this.tagStore.remove({_id: id});
        this.io.emit('tag-deleted', {_id: id})
        tagsLastUpdateMillis = Date.now();
        ctx.response.status = NO_CONTENT;
        log(`remove /:id - 204 No content (even if the resource was already deleted), or 200 Ok`);
    });
  }

  async createTag(res, tag){
      tag.version = 1;
      tag.updated = Date.now();
      let insertedTag = await this.tagStore.insert(tag);
      tagsLastUpdateMillis = tag.updated;
      this.setTagRes(res, CREATED, insertedTag);
      this.io.emit('tag/created', insertedTag);
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
