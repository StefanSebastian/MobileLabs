class ExtendableError extends Error {
    constructor(message){
        super();
        this.message = message;
        this.stack =(new Error()).stack;
        this.name = this.constructor.name;
    }
}

export class ResourceError extends ExtendableError {
    constructor(message, issue){
        super(message);
        this.issue = issue;
    }
}

// retrieve error message
export function errorPayload(err){
    if (err.issue){
        return {issue: err.issue[0].error};
    }
    return {issue: err.message};
}