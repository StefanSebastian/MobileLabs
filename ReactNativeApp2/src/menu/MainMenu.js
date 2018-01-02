import React, {Component} from 'react';
import {Keyboard} from 'react-native';

import {getLogger} from '../core/utils';
import {View, Button} from 'react-native';
import {styles} from "../core/styles";
import {FadeInView} from "../animations/FadeInView";
const log = getLogger('menu/main');

export class MainMenu extends Component {
    static navigationOptions = {
        title: 'Main menu',
    };

    constructor(props) {
        super(props);
        log('constructor');

        // hide keyboard if open
        Keyboard.dismiss();
    }

    render() {
        log('render');
        return (
            <FadeInView>
                <View style={styles.button}>
                    <Button
                        onPress={() => this.openExpenseMenu()}
                        title="Expenses"
                        color="#841584"
                        accessibilityLabel="Open expense menu"
                    />
                </View>

                <View style={styles.button}>
                    <Button
                        onPress={() => this.openTagMenu()}
                        title="Tags"
                        color="#841584"
                        accessibilityLabel="Open tag menu"
                    />
                </View>
            </FadeInView>
        );
    }

    openExpenseMenu(){
        const {navigate} = this.props.navigation;
        navigate('ExpenseMenu');
    }

    openTagMenu(){
        const {navigate} = this.props.navigation;
        navigate('TagList');
    }

}