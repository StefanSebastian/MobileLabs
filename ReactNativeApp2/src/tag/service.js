
import {getLogger} from "../core/utils";
import {action} from "../core/redux_utils";
import {getAllCall} from "./resource";
import {errorPayload} from "../core/errors";
import {Tag} from "./Tag";

const log = getLogger('tag/service');

// Loading tags
const LOAD_TAGS_STARTED = 'tag/loadStarted';
const LOAD_TAGS_SUCCEEDED = 'tag/loadSucceeded';
const LOAD_TAGS_FAILED = 'tag/loadFailed';
const CANCEL_LOAD_TAGS = 'tag/cancelLoad';

const CLEAR_ISSUE = 'tag/clearIssue';

export const loadTags = () => async(dispatch, getState) => {
    log('load tags');

    const state = getState();
    const tagState = state.tag;

    try {
        dispatch(action(LOAD_TAGS_STARTED));
        const tags = await getAllCall(state.auth.server, state.auth.token);

        if (!tagState.isLoadingCancelled){
            let newTags = [];
            for (let i = 0; i < tags.length; i++){
                newTags.push(new Tag(tags[i]._id, tags[i].name, tags[i].version));
            }
            dispatch(action(LOAD_TAGS_SUCCEEDED, newTags));
        }
    } catch(err) {
        if (!tagState.isLoadingCancelled){
            dispatch(action(LOAD_TAGS_FAILED, errorPayload(err)));
        }
    }
};

export const cancelLoadTags = () => action(CANCEL_LOAD_TAGS);

export const clearIssue = () => action(CLEAR_ISSUE);

const initialState = {items: [], isLoading: false, isLoadingCancelled: false};

export const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        // Loading
        case LOAD_TAGS_STARTED:
            return {...state, isLoading: true, isLoadingCancelled: false, issue: null};
        case LOAD_TAGS_SUCCEEDED:
            return {...state, items: action.payload, isLoading: false};
        case LOAD_TAGS_FAILED:
            return {...state, issue: action.payload.issue, isLoading: false};
        case CANCEL_LOAD_TAGS:
            return {...state, isLoading: false, isLoadingCancelled: true};
        case CLEAR_ISSUE:
            return {...state, issue: null};
        default:
            return state;
    }
};