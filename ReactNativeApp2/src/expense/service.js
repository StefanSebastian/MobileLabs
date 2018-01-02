import {action} from "../core/redux_utils";
import {getLogger} from "../core/utils";
import {getAllCall} from "./resource";
import {errorPayload} from "../core/errors";
import {Expense} from "./Expense";

const log = getLogger('expense/service');

// Loading expense
const LOAD_EXPENSES_STARTED = 'expense/loadStarted';
const LOAD_EXPENSES_SUCCEEDED = 'expense/loadSucceeded';
const LOAD_EXPENSES_FAILED = 'expense/loadFailed';

// cancel operations
const CANCEL_LOAD_EXPENSES = 'expense/cancelLoad';

// clear issues
const CLEAR_ISSUE = 'expense/clearIssue';
const CLEAR_NOTIFICATION = 'expense/clearNotification';

// network calls
export const loadExpenses = () => async(dispatch, getState) => {
    log('load expenses');

    const state = getState();

    try {
        dispatch(action(LOAD_EXPENSES_STARTED));
        const expenses = await getAllCall(state.auth.server, state.auth.token);

        if (!getState().expense.isLoadingCancelled){
            let newExpenses = [];
            for (let i = 0; i < expenses.length; i++){
                newExpenses.push(convertExpense(expenses[i]));
            }
            dispatch(action(LOAD_EXPENSES_SUCCEEDED, newExpenses));
        }
    } catch(err) {
        if (!getState().tag.isLoadingCancelled){
            dispatch(action(LOAD_EXPENSES_FAILED, errorPayload(err)));
        }
    }
};

function convertExpense(expense){
    return new Expense(expense._id, expense.info, expense.tagId, expense.amount, expense.timestamp);
}


// clear issue message
export const clearIssue = () => action(CLEAR_ISSUE);
export const clearNotification = () => action(CLEAR_NOTIFICATION);

// cancel ops
export const cancelLoadExpenses = () => action(CANCEL_LOAD_EXPENSES);

const initialState = {items: [], isLoading: false, issue: null, notification: null, isLoadingCancelled: false};

export const expenseReducer = (state = initialState, action) => {
    switch (action.type) {
        // load expenses
        case LOAD_EXPENSES_STARTED:
            return {...state, isLoading: true, issue: null, isLoadingCancelled: false};
        case LOAD_EXPENSES_SUCCEEDED:
            return {...state, isLoading: false, items: action.payload};
        case LOAD_EXPENSES_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case CANCEL_LOAD_EXPENSES:
            return {...state, isLoading: false, isLoadingCancelled: true};

        // clear messages
        case CLEAR_ISSUE:
            return {...state, issue: null};
        case CLEAR_NOTIFICATION:
            return {...state, notification: null};

        default:
            return state;
    }
};
