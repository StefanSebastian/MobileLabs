import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {styles} from "../core/styles";
import {getLogger} from "../core/utils";

const log = getLogger('tag/view');

export class TagView extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View>
                <Text style={styles.listItem}>{this.props.tag.name}</Text>
            </View>
        );
    }
}