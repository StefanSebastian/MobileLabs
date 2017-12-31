import {action} from "../core/redux_utils";
import {getLogger} from "../core/utils";
import {getToken, signUpCall} from "./resource";
import {errorPayload, ResourceError} from "../core/errors";
import {serverUrl} from "../core/api";
import {User} from "./User";

const log = getLogger('auth/service');

const AUTH_STARTED = 'auth/started';
const AUTH_SUCCEEDED = 'auth/succeeded';
const AUTH_FAILED = 'auth/failed';

const CLEAR_ISSUE = 'auth/clearIssue';

const SIGNUP_STARTED = 'signup/started';
const SIGNUP_SUCCEEDED = 'signup/succeeded';
const SIGNUP_FAILED = 'signup/failed';

/*
A function that dispatches login actions
 */
export const login = (user) => async(dispatch) => {
    log('login');
    try {
        dispatch(action(AUTH_STARTED));
        let token = await getToken({url:serverUrl}, user);
        log(`login succeeded`);
        dispatch(action(AUTH_SUCCEEDED, {user, token}));
    } catch (err) {
        log(`login failed`);
        log(JSON.stringify(errorPayload(err)));
        dispatch(action(AUTH_FAILED, errorPayload(err)));
    }
};

/*
Dispatches signup actions
 */
export const signup = (user) => async(dispatch) => {
    log('signup' + JSON.stringify(user));
    try {
        dispatch(action(SIGNUP_STARTED));
        await signUpCall({url:serverUrl}, user);
        log('signup succeeded');
        dispatch(action(SIGNUP_SUCCEEDED));
    } catch (err){
        log('signup failed');
        log(JSON.stringify(errorPayload(err)));
        dispatch(action(SIGNUP_FAILED, errorPayload(err)));
    }
};

/*
Deletes the issue message
 */
export const clearIssue = () => async(dispatch) => {
    dispatch(action(CLEAR_ISSUE));
};

const initialState = {user: new User('', ''), server: {url: serverUrl}, token: null, isLoading: false};

export const authReducer = (state = initialState, action) => {
    const payload = action.payload;
    switch (action.type) {
        case AUTH_STARTED:
            return {...state, token: null, isLoading: true};
        case AUTH_SUCCEEDED:
            return {...state, user: payload.user, token: payload.token, isLoading: false};
        case AUTH_FAILED:
            return {...state, issue: payload.issue, isLoading: false};
        case CLEAR_ISSUE:
            return {...state, issue: null};
        case SIGNUP_STARTED:
            return {...state, isLoading: true};
        case SIGNUP_FAILED:
            return {...state, issue: payload.issue, isLoading: false};
        case SIGNUP_SUCCEEDED:
            return {...state, issue: 'Successful signup', isLoading: false};
        default:
            return state;
    }
};
