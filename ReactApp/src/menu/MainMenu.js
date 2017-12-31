import React, {Component} from 'react';
import styles from '../core/styles';
import {getLogger} from '../core/utils';
import {View, Button} from 'react-native';
import {TagList} from "../tag/TagList";

const MAIN_MENU_ROUTE = 'menu/main';

const log = getLogger('menu/main');

export class MainMenu extends Component {
    static get routeName() {
        return MAIN_MENU_ROUTE;
    }

    static get route() {
        return {name: MAIN_MENU_ROUTE, title: 'Main menu'};
    }

    constructor(props) {
        super(props);
        log('constructor');
    }

    render() {
        log('render');
        return (
            <View style={styles.content}>
                <Button
                    onPress={this.openExpenseMenu}
                    title="Expenses"
                    color="#841584"
                    accessibilityLabel="Open expense menu"
                />
                <Button
                    onPress={this.openTagMenu}
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
        log("before");
        this.props.onTagMenuOpen();
        log("after");
    }

}