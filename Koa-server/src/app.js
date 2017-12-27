import Koa from 'koa';
import cors from 'koa-cors';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import http from 'http';
import socketIo from 'socket.io';
import dataStore from 'nedb-promise';
import {getLogger, timingLogger, errorHandler} from './utils';
import {TagRouter} from './tag-router';
import {AuthRouter, jwtConfig} from './auth-router';
import {ExpenseRouter} from './expense-router';
import koaJwt from 'koa-jwt';

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());
const io = socketIo(server);
const log = getLogger('app');

/*
a map of sockets for clients
*/
const connections = {};

app.use(timingLogger);
app.use(errorHandler);
app.use(bodyParser());
app.use(convert(cors()));

const apiUrl ='/api';

log('config public routes');
const authApi = new Router({prefix: apiUrl});
const userStore = dataStore({filename: '../store/users.json', autoload: true});
authApi.use('/auth', new AuthRouter({userStore, io}).routes());
app.use(authApi.routes()).use(authApi.allowedMethods());

log('config protected routes');
app.use(convert(koaJwt(jwtConfig)));
const protectedApi = new Router({prefix: apiUrl});
const tagStore = dataStore({filename: '../store/tags.json', autoload: true});
const expenseStore = dataStore({filename: '../store/expenses.json', autoload: true});
protectedApi.use('/tag', new TagRouter({tagStore, expenseStore, io, connections}).routes());
protectedApi.use('/expense', new ExpenseRouter({expenseStore, tagStore, io, connections}).routes());

app.use(protectedApi.routes()).use(protectedApi.allowedMethods());


log('config socket io');
io.on('connection', (socket) => {
    log('client connected');
    socket.on('disconnect', () => {
        log('client disconnected');
    });
    socket.on('userIdentification', (data) => {
        log(data);
        if (connections[data] == undefined){
            connections[data] = [];
        }
        connections[data].push(socket);
        log(connections[data].length);
    });
    socket.on('userDisconnect', (data) => {
        if (socket != undefined && connections[data] != undefined){
            var index = connections[data].indexOf(socket);
            if (index > -1){
                connections[data].splice(index, 1);
            }
        }
    });
});

(async() => {
    log('set some default data');
    let admin = await userStore.findOne({username: 'user1'});
    if (admin) {
        log(`admin user was in the store`);
    } else {
        admin = await userStore.insert({username: 'user1', password: 'password'});
        log(`admin added ${JSON.stringify(admin)}`);
    }

    let participant = await userStore.findOne({username: 'user2'});
    if (participant) {
        log(`test user was in the store`);
    } else {
        participant = await userStore.insert({username: 'user2', password: 'password'});
        log(`test user added ${JSON.stringify(participant)}`);
    }


    let tags = await tagStore.find({});
    if (tags.length > 0) {
        log(`tag store has ${tags.length} tags`)
    } else {
        log(`tag store was empty, adding some tag`)
        let tag = await tagStore.insert({name: "Food", updated: Date.now(), user: admin._id, version: 1})
        log(`tag added ${JSON.stringify(tag)}`);
        let tag2 = await tagStore.insert({name: "Entertainment", updated: Date.now(), user: admin._id, version: 1})
        log(`tag added ${JSON.stringify(tag)}`);
        let tag3 = await tagStore.insert({name: "Bills", updated: Date.now(), user: participant._id, version: 1})
        log(`tag added ${JSON.stringify(tag)}`);
    }
})();


server.listen(3000);
