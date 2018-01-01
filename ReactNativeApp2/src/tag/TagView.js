import React, {Component} from 'react';
import {Text, View} from "react-native";

import {getLogger} from "../core/utils";
import {styles} from "../core/styles";


const log = getLogger('tag/view');

export class TagView extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
             <View style={styles.tagItemView}>
                <Text style={styles.cardContent}>{this.props.tag.name}</Text>
             </View>
        );
    }
}