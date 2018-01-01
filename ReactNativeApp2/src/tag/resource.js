import {getLogger} from "../core/utils";
import {authHeaders} from "../core/api";
import {ResourceError} from "../core/errors";

const log = getLogger('tag/resource');

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

function interpretResult(method, url, result, json){
    if (result) {
        log(`${method} ${url} succeeded`);
        return json;
    } else {
        log(`${method} ${url} failed`);
        throw new ResourceError('Fetch failed', json.issue);
    }
}