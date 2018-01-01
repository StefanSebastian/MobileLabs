import React, {Component} from 'react';
import {Button, View, TextInput} from "react-native";

import {styles} from "../core/styles";

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
    }

    render(){
        const state = this.state;
        return (
            <View>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({...state, tagName: text})}
                />

                <View style={styles.button}>
                    <Button
                        onPress={() => this.deleteTag()}
                        title="Delete tag"
                        color="#841584"
                        accessibilityLabel="Open tag menu"
                    />
                </View>
            </View>
        );
    }

    deleteTag(){
        const {goBack} = this.props.navigation;
        goBack();
    }
}