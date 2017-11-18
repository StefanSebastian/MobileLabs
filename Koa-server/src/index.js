const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({server});
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser = require('koa-bodyparser');

app.use(bodyparser());

app.use(cors());

app.use(async (ctx, next) => { // logger
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} ${ctx.response.status} - ${ms}ms`);
});

app.use(async (ctx, next) => { // error handler
  try {
    await next();
  } catch (err) {
    ctx.response.body = { issue: [{ error: err.message || 'Unexpected error' }] };
    ctx.response.status = 500; // internal server error
  }
});

class Tag {
    constructor({id, name, version}){
        this.id = id;
        this.name = name;
        this.version = version;
    }
}

const tags = [];
tags.push(new Tag({id: 1, name:'food', version: 1}));
tags.push(new Tag({id: 2, name:'bills', version: 1}));
tags.push(new Tag({id: 3, name:'entertainment', version: 1}));

let lastUpdated = new Date(Date.now());
let lastId = 3;
const pageSize = 10;

const broadcast = data =>
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

const router = new Router();
router.get('/tag', ctx => {
  const ifModifiedSince = ctx.request.get('If-Modified-Since');
  if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= lastUpdated.getTime() - lastUpdated.getMilliseconds()) {
    ctx.response.status = 304; // NOT MODIFIED
    return;
  }
  const text = ctx.request.query.text;
  const page = ctx.request.query.page || 1;
  ctx.response.set('Last-Modified', lastUpdated.toUTCString());
  const offset = (page - 1) * pageSize;
  ctx.response.body = {
    page,
    tags: tags.slice(offset, offset + pageSize),
    more: offset + pageSize < tags.length
  };
  ctx.response.status = 200; // OK
});

const createTag = async (ctx) => {
  const tag = ctx.request.body;
  console.log(tag);
  if (!tag.name) { // validation
    ctx.response.body = { issue: [{ error: 'Name is missing' }] };
    ctx.response.status = 400; //  BAD REQUEST
    return;
  }
  tag.id = `${parseInt(lastId) + 1}`;
  lastId = tag.id;
  tag.version = 1;
  tags.push(tag);
  ctx.response.body = tag;
  ctx.response.status = 201; // CREATED
  broadcast({ event: 'created', tag });
};

router.post('/tag', async (ctx) => {
  await createTag(ctx);
});


app.use(router.routes());
app.use(router.allowedMethods());

server.listen(3000);
