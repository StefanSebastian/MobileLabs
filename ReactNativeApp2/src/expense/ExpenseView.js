import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from "react-native";

import {getLogger} from "../core/utils";
import {styles} from "../core/styles";


const log = getLogger('expense/view');

export class ExpenseView extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <TouchableOpacity onPress={() => this.props.onExpensePressed()}>
                <View style={styles.tagItemView}>
                    <Text style={styles.cardContent}>{this.props.expense.info}</Text>
                    <Text style={styles.cardContent}>Amount of: {this.props.expense.amount}</Text>
                    <Text style={styles.cardContent}>{this.props.expense.timestamp}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}