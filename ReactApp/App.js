import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TagList } from "./src/paymentApp/TagList";
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { tagReducer} from "./src/paymentApp/service";

const rootReducer = combineReducers({tag: tagReducer });
const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends React.Component {
  render() {
    return (
      <TagList store = {store}/>
    );
  }
}

