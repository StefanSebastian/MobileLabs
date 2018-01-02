import React, { Component } from 'react';
import { View} from 'react-native';

import { Bar } from 'react-native-pathjs-charts'
import {getLogger} from "../core/utils";
import {cancelLoadTags, loadTags} from "../tag/service";
import {cancelLoadExpenses, loadExpenses} from "./service";

const log = getLogger('expense/chart');

export class ExpenseChart extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Spending per category`,
    });

    constructor(props){
        super(props);

        this.state = {data: []};

        // get the store
        this.store = this.props.screenProps.store;
    }

    componentWillMount() {
        log('Component will mount');
        this.store.dispatch(loadTags());
        this.store.dispatch(loadExpenses());

        // get state from store
        this.updateState();
    }

    componentDidMount() {
        log('componentDidMount');

        // subscribe to store updates
        const store = this.store;
        this.unsubscribe = store.subscribe(() => this.updateState());
    }

    render() {
        return (
            <View>
                {this.state.data.length !== 0 &&
                    <Bar data={this.state.data}
                         options={this.options}
                         accessorKey="amount"
                    />
                }
            </View>
        )
    }

    componentWillUnmount() {
        log(`componentWillUnmount`);
        this.store.dispatch(cancelLoadTags());
        this.store.dispatch(cancelLoadExpenses());
        this.unsubscribe();
    }

    /*
   Called for every store change
    */
    updateState() {
        const expenseStore = this.store.getState().expense;
        const tagStore = this.store.getState().tag;
        const tags = tagStore.items;
        const expenses = expenseStore.items;

        let dataMap = {};

        for (let i = 0; i < expenses.length; i++){
            let tag = this.getTagName(expenses[i].category, tags);
            let category = tag.name;
            if (category){
                if (dataMap[category]){
                    dataMap[category] = dataMap[category] + expenses[i].amount;
                } else {
                    dataMap[category] = expenses[i].amount;
                }
            }
        }
        log('data: ');
        log(JSON.stringify(dataMap));


        let data = [];
        for (let property in dataMap) {
            if (dataMap.hasOwnProperty(property)) {
                data.push([{name: property, amount: dataMap[property]}]);
            }
        }

        log('data array ' + JSON.stringify(data));

        // combine auth state with component state
        const state = {...this.state, data: data};

        //log('state updated' + JSON.stringify(state));

        // set new state
        this.setState(state);
    }

    getTagName(tagId, tags){
        return tags.find((element) => element.id === tagId);
    }


    /*
    Options for chart display
     */
    options = {
        width: 300,
        height: 300,
        margin: {
            top: 20,
            left: 25,
            bottom: 50,
            right: 20
        },
        color: '#2980B9',
        gutter: 20,
        animate: {
            type: 'oneByOne',
            duration: 200,
            fillTransition: 3
        },
        axisX: {
            showAxis: true,
            showLines: true,
            showLabels: true,
            showTicks: true,
            zeroAxis: false,
            orient: 'bottom',
            label: {
                fontFamily: 'Arial',
                fontSize: 8,
                fontWeight: true,
                fill: '#34495E',
                rotate: 45
            }
        },
        axisY: {
            showAxis: true,
            showLines: true,
            showLabels: true,
            showTicks: true,
            zeroAxis: false,
            orient: 'left',
            label: {
                fontFamily: 'Arial',
                fontSize: 8,
                fontWeight: true,
                fill: '#34495E'
            }
        }
    };
}