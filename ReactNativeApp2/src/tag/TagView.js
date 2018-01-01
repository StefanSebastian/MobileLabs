import React, {Component} from 'react';
import Card from "react-native-material-cards/Card";
import CardContent from "react-native-material-cards/CardContent";
import {Text} from "react-native";

import {getLogger} from "../core/utils";
import {styles} from "../core/styles";


const log = getLogger('tag/view');

export class TagView extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Card>
                <CardContent><Text style={styles.cardContent}>{this.props.tag.name}</Text></CardContent>
            </Card>
        );
    }
}