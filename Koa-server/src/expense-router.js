import {
    OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
  CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes
} from './utils';
import Router from 'koa-router';
import {getLogger} from './utils';
import {getDecodedTokenFromRequest} from './auth-router';

const log = getLogger('expense-router');

let expenseLastUpdateMillis = null;

export class ExpenseRouter extends Router {
    constructor(props) {
        super(props);
        this.expenseStore = props.expenseStore;
        this.tagStore = props.tagStore;
        this.io = props.io;
        this.connections = props.connections;
        this.get('/', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);
            log(`decoded id ` + decoded._id);

            let res = ctx.response;
            let lastModifed = ctx.request.get(LAST_MODIFIED);
            if (lastModifed && expenseLastUpdateMillis && expenseLastUpdateMillis <= new Date(lastModifed).getTime()){
                log('search / - 304 Not Modified (the client can use the cached data)');
                res.status = NOT_MODIFIED;
            } else {
                res.body = await this.expenseStore.find({user : decoded._id});
                if (!expenseLastUpdateMillis){
                    expenseLastUpdateMillis = Date.now();
                }
                res.set({[LAST_MODIFIED]: new Date(expenseLastUpdateMillis)});
                log('search / - 200 Ok');
            }
        }).get('/:id', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);
            let expense = await this.expenseStore.findOne({_id: ctx.params.id, user: decoded._id});
            let res = ctx.response;
            if (expense) {
                log('read /:id - 200 Ok');
                this.setExpenseRes(res, OK, expense);
            } else {
                log('read /:id - 404 Not Found');
                setIssueRes(res, NOT_FOUND, [{error: 'Expense not found'}]);
            }
        }).post('/', async(ctx) => {
            let decoded = getDecodedTokenFromRequest(ctx);

            let expense = ctx.request.body;
            let res = ctx.response;

            let tag = await this.tagStore.findOne({_id: expense.tagId, user: decoded._id});
            if (tag){
                expense.user = decoded._id;
                if (!expense.amount || isNaN(parseFloat(expense.amount))){
                    log('create /- 400 Bad request');
                    setIssueRes(res, BAD_REQUEST, [{error: 'Invalid amount'}]);
                } else if (!expense.tagId || !expense.timestamp || !expense.info){
                    log('create /- 400 Bad request');
                    setIssueRes(res, BAD_REQUEST, [{error: 'All fields must be completed'}]);
                } else {
                    expense.amount = parseFloat(expense.amount);
                    await this.createExpense(res, expense, decoded.username);
                }
            } else {
                    log('invalid tag for user');
                    setIssueRes(res, NOT_FOUND, [{error: 'Tag was not found for user'}]);
            }
        }).put('/:id', async(ctx) => {
            // get the new expense from body
            let expense = ctx.request.body;
            // id of the expense to update as parameter
            let id = ctx.params.id;
            // id of the new expense
            let expenseId = expense._id;
            // extract response
            let res = ctx.response;

            let decoded = getDecodedTokenFromRequest(ctx);

            // new expense and path id should be the same
            if (expenseId && expenseId != id){
                log('update /:id - 400 bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Param id and body id should be the same'}]);
                return;
            }
            // new expense should be valid
            if (!expense.tagId || !expense.timestamp || !expense.info || !expense.amount) {
                log('update /:id - 400 Bad Request');
                setIssueRes(res, BAD_REQUEST, [{error: 'All fields must be completed'}]);
                return;
            }

            if (!expense.amount || isNaN(parseFloat(expense.amount))){
                log('create /- 400 Bad request');
                setIssueRes(res, BAD_REQUEST, [{error: 'Invalid amount'}]);
                return;
            }


            let persistedExpense = await this.expenseStore.findOne({_id: id, user:decoded._id});
            if (persistedExpense) {
              let expenseVersion = parseInt(ctx.request.get(ETAG)) || expense.version;
              if (!expenseVersion) {
                  log(`update /:id - 400 Bad Request (no version specified)`);
                  setIssueRes(res, BAD_REQUEST, [{error: 'No version specified'}]); //400 Bad Request
              } else if (expenseVersion < persistedExpense.version) {
                    log(`update /:id - 409 Conflict`);
                    setIssueRes(res, CONFLICT, [{error: 'Version conflict'}]); //409 Conflict
                } else {

                    expense.user = decoded._id;
                    expense.version = parseInt(expenseVersion) + 1;
                    expense.updated = Date.now();
                    let updatedCount = await this.expenseStore.update({_id: id}, expense);
                    expenseLastUpdateMillis = expense.updated;
                    if (updatedCount == 1) {
                      this.setExpenseRes(res, OK, expense); //200 Ok
                      this.notifyClients(decoded.username, 'expense/updated', expense);
                    } else {
                      log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                      setIssueRes(res, METHOD_NOT_ALLOWED, [{error: 'Expense no longer exists'}]); //
                    }
                 }
            } else {
                log(`update /:id - 405 Method Not Allowed (resource no longer exists)`);
                setIssueRes(res, METHOD_NOT_ALLOWED, [{error:'Expense no longer exists'}]);
            }

    }).del('/:id', async(ctx) => {
        let id = ctx.params.id;
        let decoded = getDecodedTokenFromRequest(ctx);

        // find the requested expense
        let persistedExpense = await this.expenseStore.findOne({_id: id, user:decoded._id});

        if (persistedExpense == null){
            setIssueRes(ctx.response, BAD_REQUEST, [{error: 'This expense was already deleted'}]);
            return;
        }

        // delete it
        await this.expenseStore.remove({_id: id});
        expenseLastUpdateMillis = Date.now();

        this.setExpenseRes(ctx.response, OK, persistedExpense);

        log(`remove /:id`);

        // notify clients of deletion

        let username = decoded.username;
        this.notifyClients(username, 'expense/deleted', persistedExpense);
    });
  }

  async createExpense(res, expense, username){
      expense.version = 1;
      expense.updated = Date.now();
      let insertedExpense = await this.expenseStore.insert(expense);
      expenseLastUpdateMillis = expense.updated;
      this.setExpenseRes(res, CREATED, insertedExpense);

      this.notifyClients(username, 'expense/created', insertedExpense);
  }

  async notifyClients(username, event, expense){
      let clients = this.connections[username];
      if (clients != undefined){
          for (let client of clients){
              client.emit(event, expense);
          }
      }
  }

  setExpenseRes(res, status, expense){
      res.body = expense;
      res.set({
          [ETAG]: expense.version,
          [LAST_MODIFIED]: new Date(expense.updated)
      });
      res.status = status;
  }
}
