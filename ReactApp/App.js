import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {tagReducer} from "./src/tag/service";
import {authReducer} from "./src/auth/service";
import {Router} from "./src/Router";

const rootReducer = combineReducers({tag: tagReducer, auth: authReducer});
const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <Router store = {store}/>
    );
  }
}