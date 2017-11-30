import React, {Component} from 'react';
import {Text, View, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import {login, loadUserAndServer} from './service';
import {getLogger, registerRightAction, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('auth/Login');

const LOGIN_ROUTE = 'auth/login';

export class Login extends Component {
    static get routeName() {
        return LOGIN_ROUTE;
    }

    static get route() {
        return {name: LOGIN_ROUTE, title: 'Authentication', rightText: 'Login'};
    }

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.navigator = this.props.navigator;
        this.userInfoRestored = false;
        const auth = this.store.getState().auth;
        this.state = {...auth, username: auth.user.username, password: auth.user.password, url: auth.server.url};
        log('constructor');
    }

    componentWillMount() {
        log('componentWillMount');
        this.updateState();
        registerRightAction(this.navigator, this.onLogin.bind(this));
        this.store.dispatch(loadUserAndServer());
    }

    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        return (
            <View style={styles.content}>
                <ActivityIndicator animating={state.isLoading} style={styles.activityIndicator} size="large"/>
                <Text>Server</Text>
                <TextInput value={state.url} onChangeText={(text) => this.setState({...state, url: text})}/>
                <Text>Username</Text>
                <TextInput value={state.username} onChangeText={(text) => this.setState({...state, username: text})}/>
                <Text>Password</Text>
                <TextInput value={state.password} onChangeText={(text) => this.setState({...state, password: text})}/>
                {message && <Text>{message}</Text>}
            </View>
        );
    }

    componentDidMount() {
        log(`componentDidMount`);
        this.unsubscribe = this.store.subscribe(() => this.updateState());
    }

    componentWillUnmount() {
        log(`componentWillUnmount`);
        this.unsubscribe();
    }

    updateState() {
        log(`updateState`);
        const auth = this.store.getState().auth;
        const state = {...this.state, ...auth};
        if (auth.userLoaded && !this.userInfoRestored) {
            state.username = auth.user.username;
            state.password = auth.user.password;
            state.url = auth.server.url;
            this.userInfoRestored = true;
        }
        console.log(state);
        this.setState(state);
    }

    onLogin() {
        log('onLogin');
        const state = this.state;
        this.store.dispatch(login({url: state.url}, {username: state.username, password: state.password})).then(() => {
            if (this.store.getState().auth.token) {
                this.props.onAuthSucceeded();
            }
        });
    }
}