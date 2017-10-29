const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser = require('koa-bodyparser');

app.use(bodyparser()); //1
app.use(cors()); //2
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

class Note {
  constructor({ id, text, date, version }) {
    this.id = id;
    this.text = text;
    this.date = date;
    this.version = version;
  }
}

const notes = [];
for (let i = 0; i < 21; i++) {
  notes.push(new Note({ id: `${i}`, text: `Note ${i}`, date: new Date(Date.now() + i), version: 1 }));
}
let lastUpdated = notes[notes.length - 1].date;
let lastId = notes[notes.length - 1].id;
const pageSize = 10;

const broadcast = data =>
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

const router = new Router();
router.get('/note', ctx => {
  const ifModifiedSince = ctx.request.get('If-Modified-Since');
  if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= lastUpdated.getTime() - lastUpdated.getMilliseconds()) {
    ctx.response.status = 304; // NOT MODIFIED
    return;
  }
  const text = ctx.request.query.text;
  const page = ctx.request.query.page || 1;
  ctx.response.set('Last-Modified', lastUpdated.toUTCString());
  const sortedNotes = notes
    .filter(note => text ? note.text.indexOf(text) !== -1 : true)
    .sort((n1, n2) => -(n1.date.getTime() - n2.date.getTime()));
  const offset = (page - 1) * pageSize;
  ctx.response.body = {
    page,
    notes: sortedNotes.slice(offset, offset + pageSize),
    more: offset + pageSize < sortedNotes.length
  };
  ctx.response.status = 200; // OK
});

router.get('/note/:id', async (ctx) => {
  const noteId = ctx.request.params.id;
  const note = notes.find(note => noteId === note.id);
  if (note) {
    ctx.response.body = note;
    ctx.response.status = 200; // ok
  } else {
    ctx.response.body = { issue: [{ warning: `Note with id ${noteId} not found` }] };
    ctx.response.status = 404; // NOT FOUND (if you know the resource was deleted, then return 410 GONE)
  }
});

const createNote = async (ctx) => {
  const note = ctx.request.body;
  if (!note.text) { // validation
    ctx.response.body = { issue: [{ error: 'Text is missing' }] };
    ctx.response.status = 400; //  BAD REQUEST
    return;
  }
  note.id = `${parseInt(lastId) + 1}`;
  lastId = note.id;
  note.date = Date.now();
  note.version = 1;
  notes.push(note);
  ctx.response.body = note;
  ctx.response.status = 201; // CREATED
  broadcast({ event: 'created', note });
};

router.post('/note', async (ctx) => {
  await createNote(ctx);
});

router.put('/note/:id', async (ctx) => {
  const id = ctx.params.id;
  const note = ctx.request.body;
  const noteId = note.id;
  if (noteId && id !== note.id) {
    ctx.response.body = { issue: [{ error: `Param id and body id should be the same` }] };
    ctx.response.status = 400; // BAD REQUEST
    return;
  }
  if (!noteId) {
    await createNote(ctx);
    return;
  }
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) {
    ctx.response.body = { issue: [{ error: `Note with id ${id} not found` }] };
    ctx.response.status = 400; // BAD REQUEST
    return;
  }
  const noteVersion = parseInt(ctx.request.get('ETag')) || note.version;
  if (noteVersion < notes[index].version) {
    ctx.response.body = { issue: [{ error: `Version conflict` }] };
    ctx.response.status = 409; // CONFLICT
    return;
  }
  note.version++;
  notes[index] = note;
  lastUpdated = new Date();
  ctx.response.body = note;
  ctx.response.status = 200; // OK
  broadcast({ event: 'updated', note });
});

router.del('/note/:id', ctx => {
  const id = ctx.params.id;
  const index = notes.findIndex(note => id === note.id);
  if (index !== -1) {
    const note = notes[index];
    notes.splice(index, 1);
    lastUpdated = new Date();
    broadcast({ event: 'deleted', note });
  }
  ctx.response.status = 204; // no content
});

setInterval(() => {
  lastUpdated = new Date();
  lastId = `${parseInt(lastId) + 1}`;
  const note = new Note({ id: lastId, text: `Note ${lastId}`, date: lastUpdated, version: 1 });
  notes.push(note);
  console.log(`
   ${note.text}`);
  broadcast({ event: 'created', note });
}, 15000);

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(3000);
