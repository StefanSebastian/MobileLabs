import React, {Component} from 'react';
import {getLogger} from "../core/utils";
import {NotificationClient} from "../tag/NotificationClient";

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
    }


    componentWillUnmount() {
        log('componentWillUnmount');
        this.notificationClient.disconnect();

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
}