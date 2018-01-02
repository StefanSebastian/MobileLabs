import React, {Component} from 'react';
import {Button, Text, TextInput, View} from "react-native";
import {Keyboard} from 'react-native';

import {styles} from "../core/styles";
import {addTag} from "./service";
import {displayAlert} from "../core/popups";
import {getLogger} from "../core/utils";
import {Tag} from "./Tag";

const log = getLogger('tag/save');

export class TagSave extends Component{
    constructor(props){
        super(props);

        this.store = this.props.store;

        this.state = {tagName: ''};
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
    }

    render(){
        const state = this.state;
        return (
            <View style={styles.tagSaveView}>
                <Text style={styles.text}>Add a new tag</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({...state, tagName: text})}/>
                <Button
                    title='Add tag'
                    disabled={this.state.isLoading}
                    onPress={() => this.addTagPressed()}/>
            </View>

        );
    }


    componentWillUnmount() {
        log('componentWillUnmount');
        this.unsubscribe();
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

    addTagPressed(){
        log('Save tag');
        this.store.dispatch(addTag(new Tag(null, this.state.tagName, null)));
    }
}