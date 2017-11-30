const io = require('socket.io-client');
import {getLogger} from '../core/utils';
import {tagCreated, tagUpdated, tagDeleted} from './service';

window.navigator.userAgent = 'ReactNative';

const log = getLogger('NotificationClient');

const TAG_CREATED = 'tag/created';
const TAG_UPDATED = 'tag/updated';
const TAG_DELETED = 'tag/deleted';

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
                .on('unauthorized', (msg) => log(`unauthorized: ${JSON.stringify(msg.data)}`))
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
    };

    disconnect() {
        log(`disconnect`);
        this.socket.disconnect();
    }
}