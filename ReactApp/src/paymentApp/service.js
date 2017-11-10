import { httpApiUrl, wsApiUrl} from "../core/api";
import { getLogger } from '../core/utils';

const log = getLogger('TagList');

export const loadTags = () => (dispatch) => {
    log('load tags started');
    dispatch({type: 'LOAD_TAG_STARTED'});
    fetch(`${httpApiUrl}/tag`)
        .then(response =>  response.json())
        .then(responseJson => dispatch({type:'LOAD_TAG_SUCCEEDED', data:responseJson}))
        .catch(error=> dispatch({type:'LOAD_TAG_FAILED', error}));
    log('finished fetch');
};

export const tagReducer = (state = {isLoading: false, tags: null, issue: null}, action) => {
  switch (action.type){
      case 'LOAD_TAG_STARTED':
          return {...state, isLoading: true, tags: null, issue: null};
      case 'LOAD_TAG_SUCCEEDED':
          return {...state, isLoading: false, tags: action.data.tags };
      case 'LOAD_TAG_FAILED':
          return {...state, isLoading: false, issue: action.error };
      case 'TAG_ADDED':
          return {...state, tags: (state.tags || []).concat([action.tag])};
      default:
          return state;
  }
};

export const connectWs = (store) => {
    log('connect ws started')
    const ws = new WebSocket(wsApiUrl);
    ws.onopen = () => {};
    ws.onmessage = e => store.dispatch({type: 'TAG_ADDED', tag: JSON.parse(e.data).tag});
    ws.onerror = () => {};
    ws.onclose = () => {};
    log('connect ws finished');
    return ws;
};

export const disconnectWs = (ws) => {
    ws.close();
};