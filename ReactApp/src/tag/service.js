import {action, getLogger, errorPayload} from '../core/utils';
import {search, save} from './resource';

const log = getLogger('tag/service');

// Loading tags
const LOAD_TAGS_STARTED = 'tag/loadStarted';
const LOAD_TAGS_SUCCEEDED = 'tag/loadSucceeded';
const LOAD_TAGS_FAILED = 'tag/loadFailed';
const CANCEL_LOAD_TAGS = 'tag/cancelLoad';

// Saving tags
const SAVE_TAG_STARTED = 'tag/saveStarted';
const SAVE_TAG_SUCCEEDED = 'tag/saveSucceeded';
const SAVE_TAG_FAILED = 'tag/saveFailed';
const CANCEL_SAVE_TAG = 'tag/cancelSave';

// Tag notifications
const TAG_DELETED = 'tag/deleted';

export const loadTags = () => async(dispatch, getState) => {
    log(`loadTags...`);
    const state = getState();
    const tagState = state.tag;
    try {
        dispatch(action(LOAD_TAGS_STARTED));
        const tags = await search(state.auth.server, state.auth.token)
        log(`loadTags succeeded`);
        if (!tagState.isLoadingCancelled) {
            dispatch(action(LOAD_TAGS_SUCCEEDED, tags));
        }
    } catch(err) {
        log(`loadTags failed`);
        if (!tagState.isLoadingCancelled) {
            dispatch(action(LOAD_TAGS_FAILED, errorPayload(err)));
        }
    }
};

export const cancelLoadTags = () => action(CANCEL_LOAD_TAGS);

export const saveTag = (tag) => async(dispatch, getState) => {
    log(`saveTag...`);
    const state = getState();
    const tagState = state.tag;
    try {
        dispatch(action(SAVE_TAG_STARTED));
        const savedTag = await save(state.auth.server, state.auth.token, tag);
        log(`saveTag succeeded`);
        if (!tagState.isSavingCancelled) {
            dispatch(action(SAVE_TAG_SUCCEEDED, savedTag));
        }
    } catch(err) {
        log(`saveTag failed`);
        if (!tagState.isSavingCancelled) {
            dispatch(action(SAVE_TAG_FAILED, errorPayload(err)));
        }
    }
};

export const cancelSaveTag = () => action(CANCEL_SAVE_TAG);

export const tagCreated = (createdTag) => action(SAVE_TAG_SUCCEEDED, createdTag);
export const tagUpdated = (updatedTag) => action(SAVE_TAG_SUCCEEDED, updatedTag);
export const tagDeleted = (deletedTag) => action(TAG_DELETED, deletedTag);

export const tagReducer = (state = {items: [], isLoading: false, isSaving: false}, action) => { //newState (new object)
    let items, index;
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
        // Saving
        case SAVE_TAG_STARTED:
            return {...state, isSaving: true, isSavingCancelled: false, issue: null};
        case SAVE_TAG_SUCCEEDED:
            items = [...state.items];
            index = items.findIndex((i) => i._id == action.payload._id);
            if (index != -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items, isSaving: false};
        case SAVE_TAG_FAILED:
            return {...state, issue: action.payload.issue, isSaving: false};
        case CANCEL_SAVE_TAG:
            return {...state, isSaving: false, isSavingCancelled: true};
        // Notifications
        case TAG_DELETED:
            items = [...state.items];
            const deletedTag = action.payload;
            index = state.items.findIndex((tag) => tag._id == deletedTag._id);
            if (index != -1) {
                items.splice(index, 1);
                return {...state, items};
            }
            return state;
        default:
            return state;
    }
};