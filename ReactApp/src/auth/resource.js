import {getLogger, ResourceError} from '../core/utils';
import {headers} from '../core/api';

const log = getLogger('auth/resource');

export async function getToken(server, user) {
    const url = `${server.url}/api/auth/session`;
    log(`getToken ${url}`);
    let ok;
    let json = await fetch(url, {method: 'POST', headers, body: JSON.stringify(user)})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    if (ok) {
        return json.token;
    } else {
        throw new ResourceError(`Authentication failed`, json.issue);
    }
};