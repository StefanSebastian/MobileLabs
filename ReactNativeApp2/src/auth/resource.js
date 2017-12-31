import {headers} from "../core/api";
import {getLogger} from "../core/utils";
import {ResourceError} from "../core/errors";

const log = getLogger('auth/resource');

/*
Login POST call
returns the jwt token from server
 */
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
}

/*
Signup POST call
returns the created user
 */
export async function signUpCall(server, user) {
    const url = `${server.url}/api/auth/signup`;
    log(`signUp ${url}`);

    let ok;
    let json = await fetch(url, {method: 'POST', headers, body: JSON.stringify(user)})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    if (ok) {
        return json.token;
    } else {
        throw new ResourceError(`Signup failed`, json.issue);
    }
}

