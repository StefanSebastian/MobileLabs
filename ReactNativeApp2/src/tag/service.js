
import {getLogger} from "../core/utils";
import {action} from "../core/redux_utils";
import {getAllCall, saveOrUpdateCall} from "./resource";
import {errorPayload} from "../core/errors";
import {Tag} from "./Tag";

const log = getLogger('tag/service');

// Loading tags
const LOAD_TAGS_STARTED = 'tag/loadStarted';
const LOAD_TAGS_SUCCEEDED = 'tag/loadSucceeded';
const LOAD_TAGS_FAILED = 'tag/loadFailed';
const CANCEL_LOAD_TAGS = 'tag/cancelLoad';

// Save tags
const SAVE_TAG_STARTED = 'tag/saveStarted';
const SAVE_TAG_SUCCEEDED = 'tag/saveSucceeded';
const SAVE_TAG_FAILED = 'tag/saveFailed';

const TAG_DELETED = 'tag/deleted';
const TAG_UPDATED_ADDED = 'tag/updated';

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
                newTags.push(convertTag(tags[i]));
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

export const saveTag = (tag) => async(dispatch, getState) => {
    log('save tag');

    const state = getState();

    let newTag;
    try {
        dispatch(action(SAVE_TAG_STARTED));
        newTag = await saveOrUpdateCall(state.auth.server, state.auth.token, tag);
        dispatch(action(SAVE_TAG_SUCCEEDED, convertTag(newTag)));

    } catch (err) {
        dispatch(action(SAVE_TAG_FAILED, errorPayload(err)));
    }
};

// update and add are treaded in the same case
export const tagCreated = (createdTag) => action(TAG_UPDATED_ADDED, convertTag(createdTag));
export const tagUpdated = (updatedTag) => action(TAG_UPDATED_ADDED, convertTag(updatedTag));
export const tagDeleted = (deletedTag) => action(TAG_DELETED, convertTag(deletedTag));

/*
Converts the info returned from the server to the internal tag representation
 */
function convertTag(tag) {
    return new Tag(tag._id, tag.name, tag.version);
}

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
        case SAVE_TAG_STARTED:
            return {...state, isLoading: true, issue: null};
        case SAVE_TAG_SUCCEEDED:
            return {...state, isLoading: false};
        case TAG_UPDATED_ADDED:
            let items = [...state.items];
            let index = items.findIndex((i) => i.id === action.payload.id);
            if (index !== -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items};
        case SAVE_TAG_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case TAG_DELETED:
            items = [...state.items];
            const deletedTag = action.payload;
            index = state.items.findIndex((tag) => tag.id === deletedTag.id);
            if (index !== -1) {
                items.splice(index, 1);
                return {...state, items};
            }
            return state;
        default:
            return state;
    }
};