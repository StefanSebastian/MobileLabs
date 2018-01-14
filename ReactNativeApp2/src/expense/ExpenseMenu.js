import React, {Component} from 'react';
import {Button, View, Animated} from "react-native";

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

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 1500
        }).start()
    }

    render() {
        const interpolateRotation = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        const animatedStyle = {
            transform: [
                { rotate: interpolateRotation }
            ]
        };
        log('render');
        return (
            <Animated.View style={animatedStyle}>
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
            </Animated.View>
        );
    }

    openAddExpense(){
        const {navigate} = this.props.navigation;
        navigate('AddExpense');
    }

    openListExpenses(){
        const {navigate} = this.props.navigation;
        navigate('ListExpenses');
    }

    openChartExpenses(){
        const {navigate} = this.props.navigation;
        navigate('ExpenseChart');
    }
}