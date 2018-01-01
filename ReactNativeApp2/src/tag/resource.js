import {getLogger} from "../core/utils";
import {authHeaders} from "../core/api";
import {ResourceError} from "../core/errors";

const log = getLogger('tag/resource');

/*
Gets all tags
 */
export const getAllCall = async(server, token) => {
    const url = `${server.url}/api/tag`;
    log(`get ${url}`);

    let ok;
    let json = await fetch(url, {method: 'GET', headers: authHeaders(token)})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult('GET', url, ok, json);

};

/*
Depending on the id field send a POST or PUT request for a tag
 */
export const saveOrUpdateCall = async(server, token, tag) => {
    const body = JSON.stringify(tag);
    const url = tag.id ? `${server.url}/api/tag/${tag.id}` : `${server.url}/api/tag`;
    const method = tag.id ? 'PUT' : 'POST';

    log(`${method} ${url}`);
    let ok;
    let json = await fetch(url, {method, headers: authHeaders(token), body})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult(method, url, ok, json);
};

/*
Deletes the given tag
 */
export const deleteCall = async(server, token, tag) => {
    const url = `${server.url}/api/tag/${tag.id}`;
    const method = 'DELETE';

    log(`${method} ${url}`);
    let ok;
    let json = await fetch(url, {method, headers: authHeaders(token)})
        .then(res => {
            ok = res.ok;
            return res.json;
        });
    return interpretResult(method, url, ok, json);
};

function interpretResult(method, url, result, json){
    if (result) {
        log(`${method} ${url} succeeded`);
        return json;
    } else {
        log(`${method} ${url} failed`);
        throw new ResourceError('Fetch failed', json.issue);
    }
}