import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';

import createStore from "redux/es/createStore";
import applyMiddleware from "redux/es/applyMiddleware";
import combineReducers from "redux/es/combineReducers";
import thunk from 'redux-thunk';

import {Login} from "./src/auth/Login";
import {MainMenu} from "./src/menu/MainMenu";
import {authReducer} from "./src/auth/service";
import {tagReducer} from "./src/tag/service";
import {TagList} from "./src/tag/TagList";
import {TagDetail} from "./src/tag/TagDetail";
import {ExpenseMenu} from "./src/expense/ExpenseMenu";
import {expenseReducer} from "./src/expense/service";
import {ListExpenses} from "./src/expense/ListExpenses";


// reducers for redux
const rootReducer = combineReducers({auth: authReducer, tag: tagReducer, expense: expenseReducer});
// store for redux
const store = createStore(rootReducer, applyMiddleware(thunk));

const Navigator = StackNavigator({
    Login: {
        screen: Login,
    },
    MainMenu: {
        screen: MainMenu,
    },
    TagList: {
        screen: TagList,
    },
    TagDetail: {
        screen: TagDetail
    },
    ExpenseMenu: {
        screen: ExpenseMenu
    },
    ListExpenses: {
        screen: ListExpenses
    }

    },
    {
        navigationOptions: {
            headerStyle: {
                marginTop: Expo.Constants.statusBarHeight
            },
            headerTitleStyle: {
                alignSelf: "stretch"
            }
        }
    }
);

export default class App extends Component{
    render(){
        return <Navigator screenProps={{store:store}}/>;
    }
}