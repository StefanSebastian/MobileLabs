export const action = (type, payload) => ({type, payload});

export function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timed out')), ms);
    });
}

export function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(ms), ms);
    });
}

export function getLogger(tag) {
    return message => console.log(`${tag}`, message);
}

export function issueToText(issue) {
    if (issue) {
        return issue.map(i => Object.keys(i).map(p => [p, i[p]].join(': '))).join('\n');
    }
    return null;
}

class ExtendableError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}

export class ResourceError extends ExtendableError {
    constructor(m, issue) {
        super(m);
        this.issue = issue;
    }
}

export const registerRightAction = (navigator, action) => {
    let routes = navigator.getCurrentRoutes();
    if (routes.length > 0) {
        routes[routes.length - 1].rightAction = action;
    }
}

export const errorPayload = (err) => err instanceof ResourceError ? {issue: err.issue}: {issue: [{error: err.message}]};