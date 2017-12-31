
export function getLogger(tag){
    return message => console.log(`${tag}`, message);
}

export function issueToText(issue) {
    if (issue) {
       // return issue.map(i => Object.keys(i).map(p => [p, i[p]].join(': '))).join('\n');
        return JSON.stringify(issue);
    }
    return null;
}