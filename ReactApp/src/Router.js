import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Login} from './auth/Login';
import {getLogger} from './core/utils';
import {TagList} from "./tag/TagList";
import {TagEdit} from "./tag/TagEdit";
import {MainMenu} from "./menu/MainMenu";
import {NotificationClient} from "./tag/NotificationClient";
import {Navigator} from 'react-native-deprecated-custom-components'

const log = getLogger('Router');

export class Router extends Component {
    constructor(props) {
        log(`constructor`);
        super(props);
        this.store = this.props.store;
    }

    render() {
        log(`render`);
        return (
            <Navigator
                initialRoute={Login.route}
                renderScene={this.renderScene.bind(this)}
                ref={(navigator) => this.navigator = navigator}
                navigationBar={
                    <Navigator.NavigationBar
                        style={styles.navigationBar}
                        routeMapper={NavigationBarRouteMapper}/>
                }/>
        );
    }

    componentDidMount() {
        log(`componentDidMount`);
    }

    componentWillUnmount() {
        log(`componentWillUnmount`);
    }

    renderScene(route, navigator) {
        log(`renderScene ${route.name}`);
        switch (route.name) {
            case Login.routeName:
                return <Login
                    store={this.store}
                    navigator={navigator}
                    onAuthSucceeded={() => this.onAuthSucceeded()}/>;
            case TagEdit.routeName:
                return <TagEdit
                    store={this.store}
                    navigator={navigator}/>;
            case MainMenu.routeName:
                return <MainMenu
                    store={this.store}
                    navigator={navigator}
                    onTagMenuOpen={() => this.onTagMenuOpen()}
                />;
            case TagList.routeName:
                return <TagList
                    store={this.store}
                    navigator={navigator}/>;
            default:
                return <TagList
                    store={this.store}
                    navigator={navigator}/>;
        }
    };

    onAuthSucceeded() {
        this.navigator.push(MainMenu.route);
        if (this.notificationClient) {
            this.notificationClient.disconnect();
        }
        this.notificationClient = new NotificationClient(this.store);
        this.notificationClient.connect();
    }

    pushView(route) {
        this.navigator.push(route);
        if (this.notificationClient) {
            this.notificationClient.disconnect();
        }
        this.notificationClient = new NotificationClient(this.store);
        this.notificationClient.connect();
    }

    onTagMenuOpen(){
        this.navigator.push(MainMenu.route);
        if (this.notificationClient) {
            this.notificationClient.disconnect();
        }
        this.notificationClient = new NotificationClient(this.store);
        this.notificationClient.connect();
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (index > 0) navigator.pop();
                    }}>
                    <Text style={styles.leftButton}>Back</Text>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    },
    RightButton(route, navigator, index, navState) {
        if (route.rightText) return (
            <TouchableOpacity
                onPress={() => route.rightAction()}>
                <Text style={styles.rightButton}>
                    {route.rightText}
                </Text>
            </TouchableOpacity>
        )
    },
    Title(route, navigator, index, navState) {
        return (<Text style={styles.title}>{route.title}</Text>)
    }
};

const styles = StyleSheet.create({
    navigationBar: {
        backgroundColor: 'blue',
        paddingTop: Expo.Constants.statusBarHeight
    },
    leftButton: {
        color: '#ffffff',
        margin: 10,
        fontSize: 17,
        paddingTop: Expo.Constants.statusBarHeight
    },
    title: {
        paddingVertical: 10,
        color: '#ffffff',
        justifyContent: 'center',
        fontSize: 18,
        paddingTop: Expo.Constants.statusBarHeight
    },
    rightButton: {
        color: 'white',
        margin: 10,
        fontSize: 16,
        paddingTop: Expo.Constants.statusBarHeight
    },
    content: {
        marginTop: 90,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: Expo.Constants.statusBarHeight,
    },
});