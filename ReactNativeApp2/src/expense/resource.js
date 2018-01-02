import {getLogger, interpretResult} from "../core/utils";
import {authHeaders} from "../core/api";
import {ExpenseDto} from "./ExpenseDto";

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

export const addCall = async(server, token, expense) => {
    const expenseDto = new ExpenseDto(expense.info, expense.amount, expense.category, expense.timestamp);
    const body = JSON.stringify(expenseDto);
    const url = `${server.url}/api/expense`;
    const method = 'POST';

    log(`${method} ${url}`);
    let ok;
    let json = await fetch(url, {method, headers: authHeaders(token), body})
        .then(res => {
            ok = res.ok;
            return res.json();
        });
    return interpretResult(log, method, url, ok, json);
};