import {getLogger, interpretResult} from "../core/utils";
import {authHeaders} from "../core/api";

const log = getLogger('expense/resource');

/*
Gets all tags
 */
export const getAllCall = async(server, token) => {
    const url = `${server.url}/api/expense`;
    log(`get ${url}`);

    let ok;
    let json = await fetch(url, {method: 'GET', headers: authHeaders(token)})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult(log, 'GET', url, ok, json);

};
