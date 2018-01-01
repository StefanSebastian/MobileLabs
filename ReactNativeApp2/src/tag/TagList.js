import React, {Component} from 'react';
import {ActivityIndicator, View, FlatList, TextInput, Button, Text} from "react-native";

import {cancelLoadTags, loadTags, saveTag} from "./service";
import {getLogger, issueToText} from "../core/utils";
import {styles} from "../core/styles";
import {displayAlert} from "../core/popups";
import {clearIssue} from "./service";
import {TagView} from "./TagView";
import {Tag} from "./Tag";
import {TagSave} from "./TagSave";


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
        const store = this.store;
        this.unsubscribe = store.subscribe(() => this.updateState());
        store.dispatch(loadTags());
    }


    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        return (
            <View>
                { this.state.isLoading && <ActivityIndicator animating={true} size="large"/> }

                {message && this.errorMessage(message)}

                <TagSave store={this.store}/>

                <FlatList
                    data = {this.state.items}
                    keyExtractor = {this._keyExtractor}
                    renderItem = { tag => <TagView tag={tag.item}/> }/>
            </View>
        );
    }

    // sets the key for the FlatList component
    _keyExtractor = (item, index) => item.id;

    componentWillUnmount() {
        log('componentWillUnmount');
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelLoadTags());
        }
    }

    /*
    Called for every store change
     */
    updateState() {
        const tag = this.store.getState().tag;

        // combine auth state with component state
        const state = {...this.state, ...tag};

        log('state updated' + JSON.stringify(state));

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



}