import {
  OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
  CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes
} from './utils';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import {getLogger} from './utils';

const log = getLogger('auth');

export const jwtConfig = {
  secret: 'my-secret'
}

function createToken(user) {
    log(`create token for ${user.username}`);
    return jwt.sign({username: user.username, _id: user._id},
        jwtConfig.secret, {expiresIn: 60*60*60});
}

export function decodeToken(token) {
    let decoded = jwt.decode(token, jwtConfig.secret);
    log(`decode token for ${decoded}`);
    return decoded;
}

/*
Extracts the authorization header from the request
get the token
decodes it and returns the result
*/
export function getDecodedTokenFromRequest(ctx) {
    // turn to string , and cut the Bearer part and the last "
    let token = JSON.stringify(ctx.request.header.authorization).split(" ")[1];
    token = token.substring(0, token.length - 1);

    let decoded = decodeToken(token);
    return decoded;
}

export class AuthRouter extends Router {
    constructor(args) {
        super(args);
        this.userStore = args.userStore;
        this.post('/signup', async(ctx, next) => {
            let data = ctx.request.body;
            let res = ctx.response;

            if (!data.username || !data.password){
                log('create /- 400 Bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Username or password is missing'}]);
            } else if (data.password.length < 6){
                log('create /- 400 Bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Password is too short'}]);
            }
            else {
                let userOld = await this.userStore.findOne({username:data.username});
                if (userOld){
                    log('create /- 400 Bad request');
                    setIssueRes(res, BAD_REQUEST, [{error: 'Username is already taken'}]);
                } else {
                    let user = await this.userStore.insert(ctx.request.body);
                    ctx.response.body = {token: createToken(user)};
                    ctx.status = CREATED;
                }
            }
        });
        this.post('/session', async(ctx, next) => {
            let reqBody = ctx.request.body;
            if (!reqBody.username || !reqBody.password){
                log(`session - missing username and password`);
                setIssueRes(ctx.response, BAD_REQUEST, [{error:'Username and password must be set'}]);
                return;
            }
            let user = await this.userStore.findOne({username:reqBody.username});
            if (user && user.password == reqBody.password){
                ctx.status = CREATED;
                ctx.response.body = {token: createToken(user), id: user._id};
                log('session - token created');
            } else {
                log('session - wrong password');
                setIssueRes(ctx.response, BAD_REQUEST, [{error:'Wrong password'}]);
            }
        });
    }
}
