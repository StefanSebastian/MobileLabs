import React, {Component} from 'react';
import {Text, View, TextInput, ActivityIndicator} from 'react-native';
import {saveTag, cancelSaveTag} from './service';
import {registerRightAction, issueToText, getLogger} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('TagEdit');
const TAG_EDIT_ROUTE = 'tag/edit';

export class TagEdit extends Component {
    static get routeName() {
        return TAG_EDIT_ROUTE;
    }

    static get route() {
        return {name: TAG_EDIT_ROUTE, title: 'Tag Edit', rightText: 'Save'};
    }

    constructor(props) {
        log('constructor');
        super(props);
        this.store = this.props.store;
        const nav = this.props.navigator;
        this.navigator = nav;
        const currentRoutes = nav.getCurrentRoutes();
        const currentRoute = currentRoutes[currentRoutes.length - 1];
        if (currentRoute.data) {
            this.state = {tag: {...currentRoute.data}, isSaving: false};
        } else {
            this.state = {tag: {name: ''}, isSaving: false};
        }
        registerRightAction(nav, this.onSave.bind(this));
    }

    render() {
        log('render');
        const state = this.state;
        let message = issueToText(state.issue);
        return (
            <View style={styles.content}>
                { state.isSaving &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                <Text>Text</Text>
                <TextInput value={state.tag.name} onChangeText={(text) => this.updateTagName(name)}/>
                {message && <Text>{message}</Text>}
            </View>
        );
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.props.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const state = this.state;
            const tagState = store.getState().tag;
            this.setState({...state, issue: tagState.issue});
        });
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelSaveTag());
        }
    }

    updateTagName(name) {
        let newState = {...this.state};
        newState.tag.name = name;
        this.setState(newState);
    }

    onSave() {
        log('onSave');
        this.store.dispatch(saveTag(this.state.tag)).then(() => {
            log('onTagSaved');
            if (!this.state.issue) {
                this.navigator.pop();
            }
        });
    }
}