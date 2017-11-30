import {User} from './User';
import {action, getLogger, errorPayload} from '../core/utils';
import {getToken} from './resource';
import {readUser, saveUser, readServer, saveServer} from './storage';
import {serverUrl} from '../core/api';

const log = getLogger('auth/service');

const AUTH_STARTED = 'auth/started';
const AUTH_SUCCEEDED = 'auth/succeeded';
const AUTH_FAILED = 'auth/failed';
const USER_LOADED = 'auth/userLoaded';

export const loadUserAndServer = () => async(dispatch) => {
    log(`loadUser...`);
    try {
        let result = await Promise.all([readUser(), readServer()]);
        let user = result[0], server = result[1];
        if (user && server) {
            log(`loadUser loaded ${JSON.stringify(user)}`);
            dispatch(action(USER_LOADED, {user, server}));
        }
    } catch (err) {
        log(`loadUser failed`);
        dispatch(action(USER_LOADED, {user: new User('', ''), server: {url: serverUrl}}));
    }
};

export const login = (server, user) => async(dispatch, getState) => {
    log(`login... ${server.url}`);
    try {
        dispatch(action(AUTH_STARTED));
        let token = await getToken(server, user)
        log(`login succeeded`);
        await Promise.all([saveUser(user), saveServer(server)]);
        log(`login user saved`);
        dispatch(action(AUTH_SUCCEEDED, {server, user, token}));
    } catch (err) {
        log(`login failed`);
        dispatch(action(AUTH_FAILED, errorPayload(err)));
    }
};

const initialState = {user: new User('', ''), server: {url: serverUrl}, token: null, isLoading: false};

export const authReducer = (state = initialState, action) => {
    const payload = action.payload;
    switch (action.type) {
        case USER_LOADED:
            return {...state, user: payload.user, server: payload.server, userLoaded: true};
        case AUTH_STARTED:
            return {...state, token: null, isLoading: true};
        case AUTH_SUCCEEDED:
            return {...state, user: payload.user, server: payload.server, token: payload.token, isLoading: false};
        case AUTH_FAILED:
            return {...state, issue: payload.issue, isLoading: false};
        default:
            return state;
    }
};