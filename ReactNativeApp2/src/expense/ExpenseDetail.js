import React, {Component} from 'react';
import {Button, View, TextInput, ActivityIndicator, Text} from "react-native";

import {styles} from "../core/styles";
import {getLogger, issueToText} from "../core/utils";
import {displayAlert} from "../core/popups";
import {cancelDeleteExpense, clearIssue, clearNotification, deleteExpense} from "./service";
import {cancelLoadTags, loadTags} from "../tag/service";


const log = getLogger('expense/detail');

export class ExpenseDetail extends Component {
    // navigation header
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.expense.info}`,
    });

    constructor(props){
        super(props);

        // get the expense passed from parent view
        const { params } = this.props.navigation.state;
        this.expense = params.expense;

        // get the store
        this.store = this.props.screenProps.store;
        this.state = {category:''};
    }

    componentWillMount() {
        log('Component will mount');
        this.store.dispatch(loadTags());

        // get state from store
        this.updateState();
    }

    componentDidMount() {
        log('componentDidMount');

        // subscribe to store updates
        const store = this.store;
        this.unsubscribe = store.subscribe(() => this.updateState());
    }

    render(){
        const state = this.state;
        let message = issueToText(state.issue);
        let notification = state.notification;
        return (
            <View>
                {state.isLoading && <ActivityIndicator size="large"/>}

                {message && this.errorMessage(message)}

                {notification && this.notificationMessage(notification)}

                <Text style={styles.text}>Amount: {this.expense.amount}</Text>
                <Text style={styles.text}>{this.expense.timestamp}</Text>
                <Text style={styles.text}>{this.state.category}</Text>

                <View style={styles.button}>
                    <Button
                        onPress={() => this.deleteExpensePressed()}
                        title="Delete expense"
                        color="#841584"
                        disabled={state.isLoading}
                    />
                </View>
            </View>
        );
    }

    /*
    Unsubscribe from store updates
     */
    componentWillUnmount() {
        log(`componentWillUnmount`);
        if (this.state.isLoading){
            this.store.dispatch(cancelLoadTags());
            this.store.dispatch(cancelDeleteExpense());
        }
        this.unsubscribe();
    }

    /*
   Called for every store change
    */
    updateState() {
        const expenseStore = this.store.getState().expense;
        const tagStore = this.store.getState().tag;
        const tags = tagStore.items;

        // get tag for this expense
        let tag = tags.find((element) => element.id === this.expense.category);
        if (!tag){
            tag = '';
        }

        // combine auth state with component state
        const state = {...this.state, ...expenseStore, category: tag.name};

        //log('state updated' + JSON.stringify(state));

        // set new state
        this.setState(state);
    }


    /*
  Error popup
   */
    errorMessage(message) {
        const action = () => this.store.dispatch(clearIssue());
        displayAlert("Error", message, action);
    }

    /*
    notification popup
     */
    notificationMessage(message){
        const action = () => this.store.dispatch(clearNotification());
        displayAlert("Success", message, action);
    }

    /*
    Delete the currently selected expense
     */
    deleteExpensePressed(){
        this.store.dispatch(deleteExpense(this.expense)).then(() => {
            if (this.state.issue === null) {
                const {goBack} = this.props.navigation;
                goBack();
            }
        });
    }
}