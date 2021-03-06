import React, {Component} from 'react';
import {ActivityIndicator, View, FlatList, TextInput, Button, Text, ScrollView} from "react-native";

import {cancelLoadTags, loadTags, addTag, cancelAddTag, clearNotification} from "./service";
import {getLogger, issueToText} from "../core/utils";
import {styles} from "../core/styles";
import {displayAlert} from "../core/popups";
import {clearIssue} from "./service";
import {TagView} from "./TagView";
import {Tag} from "./Tag";
import {TagSave} from "./TagSave";
import {NotificationClient} from "../core/NotificationClient";


const log = getLogger('tag/list');

export class TagList extends Component {
    static navigationOptions = {
        title: 'Tag list',
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
        store.dispatch(loadTags());

        // subscribe to server notifications
        this.notificationClient = new NotificationClient(this.store);
        this.notificationClient.connect();
    }


    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        let notification = state.notification;
        return (
            <ScrollView>
                { this.state.isLoading && <ActivityIndicator animating={true} size="large"/> }

                {message && this.errorMessage(message)}

                {notification && this.notificationMessage(notification)}

                <TagSave store={this.store}/>

                <Text style={styles.text}>All tags</Text>
                <FlatList
                    data = {this.state.items}
                    extraData = {this.state}
                    keyExtractor = {this._keyExtractor}
                    // render item with onTagPressed callback
                    renderItem = { tag => <TagView tag={tag.item} onTagPressed = {() => this.onTagPressed(tag.item)}/> }/>
            </ScrollView>
        );
    }

    // sets the key for the FlatList component
    _keyExtractor = (item, index) => item.id;

    componentWillUnmount() {
        log('componentWillUnmount');
        this.notificationClient.disconnect();
        this.cancelCalls();

        this.unsubscribe();
    }

    /*
    cancels any ongoing calls
     */
    cancelCalls(){
        this.store.dispatch(cancelLoadTags());
        this.store.dispatch(cancelAddTag());
    }

    /*
    Called for every store change
     */
    updateState() {
        const tag = this.store.getState().tag;

        // combine auth state with component state
        const state = {...this.state, ...tag};

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

    /*
    Callback for when a tag from the flatlist is pressed
    navigates to TagDetail view and passes a parameter
     */
    onTagPressed(tag){
        log(tag.name + ' pressed');
        this.cancelCalls();

        const {navigate} = this.props.navigation;
        navigate('TagDetail', {tag: tag});
    }
}