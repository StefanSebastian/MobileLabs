import {ResourceError} from "./errors";

/*
create a logger
 */
export function getLogger(tag){
    return message => console.log(`${tag}`, message);
}

/*
Convert an issue json to a string
 */
export function issueToText(issue) {
    if (issue) {
        return JSON.stringify(issue);
    }
    return null;
}

/*
Interpret result of fetch call
 */
export function interpretResult(log, method, url, result, json){
    if (result) {
        log(`${method} ${url} succeeded`);
        return json;
    } else {
        log(`${method} ${url} failed`);
        throw new ResourceError('Fetch failed', json.issue);
    }
}