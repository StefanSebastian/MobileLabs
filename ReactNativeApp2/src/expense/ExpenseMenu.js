import React, {Component} from 'react';
import {Button, View} from "react-native";

import {getLogger} from "../core/utils";
import {styles} from "../core/styles";

const log = getLogger('expense/menu');

export class ExpenseMenu extends Component {
    static navigationOptions = {
        title: 'Expense menu',
    };

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        log('render');
        return (
            <View>
                <View style={styles.button}>
                    <Button
                        onPress={() => this.openAddExpense()}
                        title="Add expense"
                        color="#841584"
                    />
                </View>

                <View style={styles.button}>
                    <Button
                        onPress={() => this.openListExpenses()}
                        title="List expenses"
                        color="#841584"
                    />
                </View>

                <View style={styles.button}>
                    <Button
                        onPress={() => this.openChartExpenses()}
                        title="Chart"
                        color="#841584"
                    />
                </View>
            </View>
        );
    }

    openAddExpense(){

    }

    openListExpenses(){
        const {navigate} = this.props.navigation;
        navigate('ListExpenses');
    }

    openChartExpenses(){

    }
}