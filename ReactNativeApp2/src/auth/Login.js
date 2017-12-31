import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator, Button} from 'react-native';

import {getLogger, issueToText} from "../core/utils";
import {clearIssue, login, signup} from "./service";
import {displayAlert} from "../core/popups";
import {styles} from "../core/styles";

const log = getLogger('auth/login');

export class Login extends Component {
    static navigationOptions = {
        title: 'Login',
    };

    constructor(props) {
        log('constructor');
        super(props);

        // get store
        this.store = this.props.screenProps.store;

        //set initial state
        this.state = {username: '', password: ''};
    }

    componentWillMount() {
        log('Component will mount');

        // get state from store
        this.updateState();
    }

    /*
    Capture updates from store
     */
    componentDidMount() {
        log(`componentDidMount`);
        this.unsubscribe = this.store.subscribe(() => this.updateState());
    }

    /*
    Unsubscribe from store updates
     */
    componentWillUnmount() {
        log(`componentWillUnmount`);
        this.unsubscribe();
    }

    render() {
        // get current state
        const state = this.state;
        const message = issueToText(state.issue);
        // build view
        return (
            <View style={styles.content}>
                <Text style={styles.text}>Username</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({...state, username: text})}/>

                <Text style={styles.text}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({...state, password: text})}/>

                <View style={styles.button}>
                    <Button
                        title='Login'
                        disabled={state.isLoading}
                        onPress={() => this.loginPressed()}/>
                </View>

                <View style={styles.button}>
                    <Button
                        title='Signup'
                        disabled={state.isLoading}
                        onPress={() => this.signupPressed()}/>
                </View>
                {message && this.errorMessage(message)}
                {state.isLoading && <ActivityIndicator size="large"/>}
            </View>
        );
    }

    /*
    Called for every store change
     */
    updateState() {
        const auth = this.store.getState().auth;

        // combine auth state with component state
        const state = {...this.state, ...auth};

        log('state updated' + JSON.stringify(state));

        // set new state
        this.setState(state);
    }

    errorMessage(message) {
        const action = () => this.store.dispatch(clearIssue());
        displayAlert("Error", message, action);
    }

    signupPressed() {
        log('Signup');

        const state = this.state;
        this.store.dispatch(signup({username: state.username, password: state.password}));
    }

    loginPressed() {
        log('Login');

        const state = this.state;
        this.store.dispatch(login({username: state.username, password: state.password}))
            .then(() => {
                if (this.store.getState().auth.token) {
                    const {navigate} = this.props.navigation;
                    navigate('MainMenu');
                }
            });
    }
}

