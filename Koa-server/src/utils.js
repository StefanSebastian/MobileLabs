export function getLogger(tag) {
    return function (msg) {
        console.log(`${tag} - ${msg}`);
    }
}

const timingLog = getLogger('timing logger');

export const timingLogger = async(ctx, next) => {
        const start = new Date();
        await next();
        timingLog(`${ctx.method} ${ctx.url} => ${ctx.response.status}, ${new Date() - start}ms`);
};

const issueLog = getLogger('issue logger');

export const errorHandler = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        issueLog(err);
        setIssueRes(ctx.response, 500, [{error: err.message || 'Unexpected error'}]);
    }
};

export const setIssueRes = (res, status, issue) => {
    res.body = {issue: issue};
    res.status = status;
    issueLog(`${res.status}, ${JSON.stringify(res.body)}`);
}

export const LAST_MODIFIED = 'Last-Modified',
    ETAG = 'ETag',
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409;
