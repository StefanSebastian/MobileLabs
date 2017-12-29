import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { tagReducer } from "./src/tag/service";
import { authReducer } from "./src/auth/service";
import { StackNavigator } from 'react-navigation';
import { Login } from './src/auth/Login';
import { TagList } from "./src/tag/TagList";
import { addNavigationHelpers } from 'react-navigation';
import {Router} from "./src/Router";

// reducers for redux
const rootReducer = combineReducers({tag: tagReducer, auth: authReducer});
// store for redux
const store = createStore(rootReducer, applyMiddleware(thunk));


export default class App extends React.Component {
  render() {
    return (
      <Router store = {store}/>
    );
  }
}