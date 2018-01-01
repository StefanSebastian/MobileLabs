import React, {Component} from 'react';

import {getLogger} from '../core/utils';
import {View, Button} from 'react-native';

const log = getLogger('menu/main');

export class MainMenu extends Component {
    static navigationOptions = {
        title: 'Main menu',
    };

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        log('render');
        return (
            <View>
                <Button
                    onPress={() => this.openExpenseMenu()}
                    title="Expenses"
                    color="#841584"
                    accessibilityLabel="Open expense menu"
                />
                <Button
                    onPress={() => this.openTagMenu()}
                    title="Tags"
                    color="#841584"
                    accessibilityLabel="Open tag menu"
                />
            </View>
        );
    }

    openExpenseMenu(){

    }

    openTagMenu(){
        const {navigate} = this.props.navigation;
        navigate('TagList');
    }

}