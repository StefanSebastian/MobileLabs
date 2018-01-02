import React, {Component} from 'react';
import {ActivityIndicator, FlatList, ScrollView} from "react-native";

import {getLogger, issueToText} from "../core/utils";
import {NotificationClient} from "../tag/NotificationClient";
import {displayAlert} from "../core/popups";
import {cancelLoadExpenses, clearIssue, clearNotification, loadExpenses} from "./service";
import {ExpenseView} from "./ExpenseView";

const log = getLogger('expense/list');

export class ListExpenses extends Component {
    static navigationOptions = {
        title: 'Expense list',
    };

    constructor(props){
        super(props);

        this.store = this.props.screenProps.store;
    }

    componentWillMount() {
        log('Component will mount');

        // get state from store
        this.updateState();
    }

    componentDidMount() {
        log('componentDidMount');

        // subscribe to store updates
        const store = this.store;
        this.unsubscribe = store.subscribe(() => this.updateState());

        // subscribe to server notifications
        this.notificationClient = new NotificationClient(this.store);
        this.notificationClient.connect();

        // load expenses
        store.dispatch(loadExpenses());
    }

    render(){
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        let notification = state.notification;
        return (
            <ScrollView>
                { this.state.isLoading && <ActivityIndicator animating={true} size="large"/> }

                {message && this.errorMessage(message)}

                {notification && this.notificationMessage(notification)}

                <FlatList
                    data = {this.state.items}
                    keyExtractor = {this._keyExtractor}
                    // render item with onExpensePressed callback
                    renderItem = { expense => <ExpenseView expense={expense.item}
                                                           onExpensePressed = {() => this.onExpensePressed(expense.item)}/> }
                />
            </ScrollView>
        );
    }

    // sets the key for the FlatList component
    _keyExtractor = (item, index) => item.id;

    componentWillUnmount() {
        log('componentWillUnmount');
        this.notificationClient.disconnect();

        if (this.state.isLoading){
            this.store.dispatch(cancelLoadExpenses());
        }

        this.unsubscribe();
    }

    /*
    Called for every store change
     */
    updateState() {
        const expense = this.store.getState().expense;

        // combine expense state with component state
        const state = {...this.state, ...expense};

        // log('state updated' + JSON.stringify(state));

        // set new state
        this.setState(state);
    }

    errorMessage(message){
        const action = () => this.store.dispatch(clearIssue());
        displayAlert("Error", message, action);
    }

    notificationMessage(message){
        const action = () => this.store.dispatch(clearNotification());
        displayAlert("Success", message, action);
    }

    onExpensePressed(expense){
        log(JSON.stringify(expense) + ' pressed');
    }
}