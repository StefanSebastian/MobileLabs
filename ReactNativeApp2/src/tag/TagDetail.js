import React, {Component} from 'react';
import {Button, View, TextInput, ActivityIndicator} from "react-native";

import {styles} from "../core/styles";
import {displayAlert} from "../core/popups";
import {cancelDeleteTag, deleteTag} from "./service";
import {getLogger} from "../core/utils";

const log = getLogger('tag/detail');

export class TagDetail extends Component {
    // navigation header
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.tag.name}`,
    });

    constructor(props){
        super(props);

        const { params } = this.props.navigation.state;
        this.tag = params.tag;
        this.state = {tagName: ''};

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
    }

    render(){
        const state = this.state;
        return (
            <View>
                {state.isLoading && <ActivityIndicator size="large"/>}

                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({...state, tagName: text})}
                />

                <View style={styles.button}>
                    <Button
                        onPress={() => this.deleteTagPressed()}
                        title="Delete tag"
                        color="#841584"
                        disabled={state.isLoading}
                        accessibilityLabel="Open tag menu"
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
            log('Canceling delete call');
            this.store.dispatch(cancelDeleteTag());
        }

        this.unsubscribe();
    }

    /*
   Called for every store change
    */
    updateState() {
        const tag = this.store.getState().tag;

        // combine auth state with component state
        const state = {...this.state, ...tag};

        //log('state updated' + JSON.stringify(state));

        // set new state
        this.setState(state);
    }

    /*
    Delete the currently selected tag
     */
    deleteTagPressed(){
        this.store.dispatch(deleteTag(this.tag)).then(() => {
            if (this.state.issue === null) {
                const {goBack} = this.props.navigation;
                goBack();
            }
        });
    }
}