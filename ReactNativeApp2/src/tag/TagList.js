import React, {Component} from 'react';
import {ActivityIndicator, View, FlatList} from "react-native";

import {cancelLoadTags, loadTags} from "./service";
import {getLogger, issueToText} from "../core/utils";
import {styles} from "../core/styles";
import {displayAlert} from "../core/popups";
import {clearIssue} from "./service";
import {TagView} from "./TagView";

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
        let message = issueToText(this.state.issue);
        return (
            <View style={styles.content}>
                { this.state.isLoading && <ActivityIndicator animating={true} size="large"/> }

                {message && this.errorMessage(message)}

                <FlatList
                    data = {this.state.items}
                    keyExtractor = {this._keyExtractor}
                    renderItem = { tag => <TagView tag={tag.item}/> }/>
            </View>
        );
    }

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