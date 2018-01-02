import {action} from "../core/redux_utils";
import {getLogger} from "../core/utils";
import {addCall, getAllCall} from "./resource";
import {errorPayload} from "../core/errors";
import {Expense} from "./Expense";

const log = getLogger('expense/service');

// Loading expense
const LOAD_EXPENSES_STARTED = 'expense/loadStarted';
const LOAD_EXPENSES_SUCCEEDED = 'expense/loadSucceeded';
const LOAD_EXPENSES_FAILED = 'expense/loadFailed';

// Add expense
const ADD_EXPENSE_STARTED = 'expense/addStarted';
const ADD_EXPENSE_SUCCEEDED = 'expense/addSucceeded';
const ADD_EXPENSE_FAILED = 'expense/addFailed';

// cancel operations
const CANCEL_LOAD_EXPENSES = 'expense/cancelLoad';
const CANCEL_ADD_EXPENSE = 'expense/cancelAdd';

// clear issues
const CLEAR_ISSUE = 'expense/clearIssue';
const CLEAR_NOTIFICATION = 'expense/clearNotification';

// notifications
const EXPENSE_UPDATED_ADDED = 'expense/updatedAdded';
const EXPENSE_DELETED = 'expense/deleted';

// socket notifications
// update and add are treaded in the same case
export const expenseCreated = (createdExpense) => action(EXPENSE_UPDATED_ADDED, convertExpense(createdExpense));
export const expenseUpdated = (updatedExpense) => action(EXPENSE_UPDATED_ADDED, convertExpense(updatedExpense));
export const expenseDeleted = (deletedExpense) => action(EXPENSE_DELETED, convertExpense(deletedExpense));

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
        log('Loading cancelled : ' + getState().expense.isLoadingCancelled);
        if (!getState().expense.isLoadingCancelled){
            dispatch(action(LOAD_EXPENSES_FAILED, errorPayload(err)));
        }
    }
};

export const addExpense = (expense) => async(dispatch, getState) => {
    log('load expenses');

    const state = getState();

    try {
        dispatch(action(ADD_EXPENSE_STARTED));
        await addCall(state.auth.server, state.auth.token, expense);

        if (!getState().expense.isAddCancelled){
            dispatch(action(ADD_EXPENSE_SUCCEEDED));
        }
    } catch(err) {
        if (!getState().expense.isAddCancelled){
            dispatch(action(ADD_EXPENSE_FAILED, errorPayload(err)));
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
export const cancelAddExpense = () => action(CANCEL_ADD_EXPENSE);

const initialState = {items: [], isLoading: false, issue: null,
    notification: null, isLoadingCancelled: false, isAddCancelled: false};

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

        // add expense
        case ADD_EXPENSE_STARTED:
            return {...state, isLoading: true, issue: null, isAddCancelled: false};
        case ADD_EXPENSE_SUCCEEDED:
            return {...state, isLoading: false, notification: "Add succesful"};
        case ADD_EXPENSE_FAILED:
            return {...state, isLoading: false, issue: action.payload.issue};
        case CANCEL_ADD_EXPENSE:
            return {...state, isLoading: false, isAddCancelled: true};

        // clear messages
        case CLEAR_ISSUE:
            return {...state, issue: null};
        case CLEAR_NOTIFICATION:
            return {...state, notification: null};

        // server notifications
        case EXPENSE_UPDATED_ADDED:
            let items = [...state.items];
            let index = items.findIndex((i) => i.id === action.payload.id);
            if (index !== -1) {
                items.splice(index, 1, action.payload);
            } else {
                items.push(action.payload);
            }
            return {...state, items};
        case EXPENSE_DELETED:
            items = [...state.items];
            const deletedExpense = action.payload;
            index = state.items.findIndex((tag) => tag.id === deletedExpense.id);
            if (index !== -1) {
                items.splice(index, 1);
                return {...state, items};
            }
            return state;

        default:
            return state;
    }
};
