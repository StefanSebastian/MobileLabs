import {getLogger, interpretResult} from "../core/utils";
import {authHeaders} from "../core/api";
import {TagDto} from "./TagDto";

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
    return interpretResult(log, 'GET', url, ok, json);

};

/*
Depending on the id field send a POST or PUT request for a tag
 */
export const saveOrUpdateCall = async(server, token, tag) => {
    let body;
    if (tag.id){
        let tagDto = new TagDto(tag.id, tag.name, tag.version);
        body = JSON.stringify(tagDto);
    } else {
        body = JSON.stringify({name: tag.name});
    }

    const url = tag.id ? `${server.url}/api/tag/${tag.id}` : `${server.url}/api/tag`;
    const method = tag.id ? 'PUT' : 'POST';

    log(`${method} ${url}`);
    let ok;
    let json = await fetch(url, {method, headers: authHeaders(token), body})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult(log, method, url, ok, json);
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
    return interpretResult(log, method, url, ok, json);
};
