import React, {Component} from 'react';
import {ActivityIndicator, Button, Picker, Text, TextInput, View} from "react-native";

import {getLogger, issueToText} from "../core/utils";
import {NotificationClient} from "../core/NotificationClient";
import {cancelLoadTags, loadTags} from "../tag/service";
import {addExpense, cancelAddExpense, clearIssue, clearNotification} from "./service";
import {displayAlert} from "../core/popups";
import {styles} from "../core/styles";
import {Expense} from "./Expense";

const log = getLogger('expense/add');

export class AddExpense extends Component {
    static navigationOptions = {
        title: 'Add expense',
    };

    constructor(props){
        super(props);
        log("constructor");

        this.store = this.props.screenProps.store;
        this.state = {info: "", amount: "", selectedTag: "", tags: []};
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

        store.dispatch(loadTags());
    }

    render(){
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        let notification = state.notification;
        log("selected tag " + this.state.selectedTag);
        return (
            <View>
                { this.state.isLoading && <ActivityIndicator animating={true} size="large"/> }

                {message && this.errorMessage(message)}

                {notification && this.notificationMessage(notification)}

                 <TextInput
                     style={styles.textInput}
                     placeholder = "Information"
                     onChangeText={(text) => this.setState({...state, info: text})}
                 />

                 <TextInput
                     style={styles.textInput}
                     placeholder = "Amount"
                     onChangeText={(text) => this.setState({...state, amount: text})}
                 />

                <Picker
                    prompt="Select tag"
                    selectedValue={this.state.selectedTag}
                    onValueChange={(itemValue, itemIndex) => this.setState({...state, selectedTag: itemValue})}>
                    <Picker.Item label="Select a category" value='0'/>
                    {this.state.tags.map((item, index) => {
                        return (<Picker.Item label={item.name} value={item.id} key={index}/>)
                    })}
                </Picker>

                <View style={styles.button}>
                    <Button
                        onPress={() => this.addExpensePressed()}
                        title="Add expense"
                        color="#841584"
                        disabled={state.isLoading}
                    />
                </View>

            </View>
        );
    }


    componentWillUnmount() {
        log('componentWillUnmount');
        this.notificationClient.disconnect();

        if (this.state.isLoading){
            this.store.dispatch(cancelLoadTags());
            this.store.dispatch(cancelAddExpense());
        }

        this.unsubscribe();
    }

    /*
    Called for every store change
     */
    updateState() {
        const expense = this.store.getState().expense;

        const tags = this.store.getState().tag.items;

        // combine expense state with component state
        const state = {...this.state, ...expense, tags: tags};

        // log('state updated' + JSON.stringify(state));

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

    addExpensePressed(){
        const state = this.state;

        let dateFormat = require('dateformat');
        let date = new Date();
        let dateStr = dateFormat(date, "mmm dd, yyyy HH:mm:ss");
        let expense = new Expense(null, state.info, state.selectedTag, state.amount, dateStr);

        log("add " + JSON.stringify(expense));
        this.store.dispatch(addExpense(expense));
    }
}