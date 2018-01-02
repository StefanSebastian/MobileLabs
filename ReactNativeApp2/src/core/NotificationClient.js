import {tagCreated, tagDeleted, tagUpdated} from "../tag/service";

const io = require('socket.io-client');

import {getLogger} from "./utils";
import {expenseCreated, expenseDeleted, expenseUpdated} from "../expense/service";

const log = getLogger('NotificationClient');

const TAG_CREATED = 'tag/created';
const TAG_UPDATED = 'tag/updated';
const TAG_DELETED = 'tag/deleted';

const EXPENSE_CREATED = 'expense/created';
const EXPENSE_UPDATED = 'expense/updated';
const EXPENSE_DELETED = 'expense/deleted';

export class NotificationClient {
    constructor(store) {
        this.store = store;
    }

    connect() {
        log(`connect...`);
        const store = this.store;
        const auth = store.getState().auth;
        this.socket = io(auth.server.url, {transports: ['websocket']});
        const socket = this.socket;
        socket.on('connect', () => {
            log('connected');
            socket
                .emit('authenticate', {token: auth.token})
                .on('authenticated', () => log(`authenticated`))
                .on('unauthorized', (msg) => log(`unauthorized: ${JSON.stringify(msg.data)}`));

            socket.emit('userIdentification', auth.user.username);
        });
        socket.on(TAG_CREATED, (tag) => {
            log(TAG_CREATED);
            store.dispatch(tagCreated(tag));
        });
        socket.on(TAG_UPDATED, (tag) => {
            log(TAG_UPDATED);
            store.dispatch(tagUpdated(tag))
        });
        socket.on(TAG_DELETED, (tag) => {
            log(TAG_DELETED);
            store.dispatch(tagDeleted(tag))
        });
        socket.on(EXPENSE_CREATED, (expense) => {
            log(EXPENSE_CREATED);
            store.dispatch(expenseCreated(expense));
        });
        socket.on(EXPENSE_DELETED, (expense) => {
           log(EXPENSE_DELETED);
           store.dispatch(expenseDeleted(expense));
        });
        socket.on(EXPENSE_UPDATED, (expense) => {
           log(EXPENSE_UPDATED);
           store.dispatch(expenseUpdated(expense));
        });
    };

    disconnect() {
        log(`disconnect`);
        const auth = this.store.getState().auth;
        this.socket.emit('userDisconnect', auth.user.username);
        this.socket.disconnect();
    }
}