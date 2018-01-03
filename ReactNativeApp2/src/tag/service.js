
import {getLogger} from "../core/utils";
import {action} from "../core/redux_utils";
import {deleteCall, getAllCall, saveOrUpdateCall} from "./resource";
import {errorPayload} from "../core/errors";
import {Tag} from "./Tag";

const log = getLogger('tag/service');

// Loading tags
const LOAD_TAGS_STARTED = 'tag/loadStarted';
const LOAD_TAGS_SUCCEEDED = 'tag/loadSucceeded';
const LOAD_TAGS_FAILED = 'tag/loadFailed';

// cancel operations
const CANCEL_LOAD_TAGS = 'tag/cancelLoad';
const CANCEL_ADD_TAG = 'tag/cancelAdd';
const CANCEL_UPDATE_TAG = 'tag/cancelUpdate';
const CANCEL_DELETE_TAG = 'tag/cancelDelete';

// Save tags
const ADD_TAG_STARTED = 'tag/addStarted';
const ADD_TAG_SUCCEEDED = 'tag/addSucceeded';
const ADD_TAG_FAILED = 'tag/addFailed';

// update tags
const UPDATE_TAG_STARTED = 'tag/updateStarted';
const UPDATE_TAG_SUCCEEDED = 'tag/updateSucceeded';
const UPDATE_TAG_FAILED = 'tag/updateFailed';

// Delete tags
const DELETE_TAG_STARTED = 'tag/deleteStarted';
const DELETE_TAG_SUCCEEDED = 'tag/deleteSucceeded';
const DELETE_TAG_FAILED = 'tag/deleteFailed';

const TAG_DELETED = 'tag/deleted';
const TAG_UPDATED_ADDED = 'tag/updated';

const CLEAR_ISSUE = 'tag/clearIssue';
const CLEAR_NOTIFICATION = 'tag/clearNotification';

// network calls
export const loadTags = () => async(dispatch, getState) => {
    log('load tags');

    const state = getState();
    const tagState = state.tag;

    try {
        dispatch(action(LOAD_TAGS_STARTED));
        const tags = await getAllCall(state.auth.server, state.auth.token);

        if (!getState().tag.isLoadingCancelled){
            let newTags = [];
            for (let i = 0; i < tags.length; i++){
                newTags.push(convertTag(tags[i]));
            }
            dispatch(action(LOAD_TAGS_SUCCEEDED, newTags));
        }
    } catch(err) {
        if (!getState().tag.isLoadingCancelled){
            dispatch(action(LOAD_TAGS_FAILED, errorPayload(err)));
        }
    }
};

export const addTag = (tag) => async(dispatch, getState) => {
    log('save tag');

    const state = getState();
    const tagState = state.tag;

    let newTag;
    try {
        dispatch(action(ADD_TAG_STARTED));
        newTag = await saveOrUpdateCall(state.auth.server, state.auth.token, tag);

        if (!getState().tag.isAddCancelled){
            dispatch(action(ADD_TAG_SUCCEEDED, convertTag(newTag)));
        }
    } catch (err) {
        if (!getState().tag.isAddCancelled){
            dispatch(action(ADD_TAG_FAILED, errorPayload(err)));
        }
    }
};

export const deleteTag = (tag) => async(dispatch, getState) => {
    log('delete tag');

    const state = getState();
    const tagState = state.tag;

    try {
        dispatch(action(DELETE_TAG_STARTED));
        await deleteCall(state.auth.server, state.auth.token, tag);

        if (!getState().tag.isDeleteCancelled){
            dispatch(action(DELETE_TAG_SUCCEEDED));
        }
    } catch (err){
        if (!getState().tag.isDeleteCancelled){
            dispatch(action(DELETE_TAG_FAILED, errorPayload(err)));
        }
    }
};

export const updateTag = (tag) => async(dispatch, getState) => {
    log('update tag');

    const state = getState();

    try {
        dispatch(action(UPDATE_TAG_STARTED));
        await saveOrUpdateCall(state.auth.server, state.auth.token, tag);

        if (!getState().tag.isUpdateCancelled){
            dispatch(action(UPDATE_TAG_SUCCEEDED));
        }
    } catch (err){
        if (!getState().tag.isUpdateCancelled){
            dispatch(action(UPDATE_TAG_FAILED, errorPayload(err)));
        }
    }
};

// cancel operations
export const cancelLoadTags = () => action(CANCEL_LOAD_TAGS);
export const cancelAddTag = () => action(CANCEL_ADD_TAG);
export const cancelUpdateTag = () => action(CANCEL_UPDATE_TAG);
export const cancelDeleteTag = () => action(CANCEL_DELETE_TAG);

// clear issue message
export const clearIssue = () => action(CLEAR_ISSUE);
export const clearNotification = () => action(CLEAR_NOTIFICATION);

// socket notifications
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

const initialState = {items: [], isLoading: false, isLoadingCancelled: false, isRefreshingTags:false,
    isDeleteCancelled: false, isAddCancelled: false, isUpdateCancelled: false};

export const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        // Loading
        case LOAD_TAGS_STARTED:
            return {...state, isRefreshingTags: true, isLoadingCancelled: false};
        case LOAD_TAGS_SUCCEEDED:
            return {...state, items: action.payload, isRefreshingTags: false};
        case LOAD_TAGS_FAILED:
            return {...state, isRefreshingTags: false};
        case CANCEL_LOAD_TAGS:
            return {...state, isRefreshingTags: false, isLoadingCancelled: true};

        // delete
        case DELETE_TAG_STARTED:
            return {...state, isLoading: true, isDeleteCancelled: false};
        case DELETE_TAG_SUCCEEDED:
            return {...state, isLoading: false, notification:'Succesful delete'};
        case DELETE_TAG_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case CANCEL_DELETE_TAG:
            return {...state, isLoading: false, isDeleteCancelled: true};

        // add
        case ADD_TAG_STARTED:
            return {...state, isLoading: true, issue: null, isAddCancelled:false};
        case ADD_TAG_SUCCEEDED:
            return {...state, isLoading: false, notification:'Succesful add'};
        case ADD_TAG_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case CANCEL_ADD_TAG:
            return {...state, isLoading: false, isAddCancelled: true};

        // update
        case UPDATE_TAG_STARTED:
            return {...state, isLoading: true, issue: null, isUpdateCancelled: false};
        case UPDATE_TAG_SUCCEEDED:
            return {...state, isLoading: false, notification:'Successful update'};
        case UPDATE_TAG_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case CANCEL_UPDATE_TAG:
            return {...state, isLoading: false, isUpdateCancelled: true};

        case CLEAR_ISSUE:
            return {...state, issue: null};
        case CLEAR_NOTIFICATION:
            return {...state, notification: null};

        // notifications
        case TAG_UPDATED_ADDED:
            let items = [...state.items];
            let index = items.findIndex((i) => i.id === action.payload.id);
            if (index !== -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items};

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