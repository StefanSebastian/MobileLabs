import React, {Component} from 'react';
import {ListView, Text, View, StatusBar, ActivityIndicator} from 'react-native';
import {TagEdit} from './TagEdit';
import {TagView} from './TagView';
import {loadTags, cancelLoadTags} from './service';
import {registerRightAction, getLogger, issueToText} from '../core/utils';
import styles from '../core/styles';

const log = getLogger('TagList');
const TAG_LIST_ROUTE = 'tag/list';

export class TagList extends Component {
    static get routeName() {
        return TAG_LIST_ROUTE;
    }

    static get route() {
        return {name: TAG_LIST_ROUTE, title: 'Tag List', rightText: 'New'};
    }

    constructor(props) {
        super(props);
        log('constructor');
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
        this.store = this.props.store;
        const tagState = this.store.getState().tag;
        this.state = {isLoading: tagState.isLoading, dataSource: this.ds.cloneWithRows(tagState.items)};
        registerRightAction(this.props.navigator, this.onNewTag.bind(this));
    }

    render() {
        log('render');
        let message = issueToText(this.state.issue);
        return (
            <View style={styles.content}>
                { this.state.isLoading &&
                <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                }
                {message && <Text>{message}</Text>}
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={tag => (<TagView tag={tag} onPress={(tag) => this.onTagPress(tag)}/>)}/>
            </View>
        );
    }

    onNewTag() {
        log('onNewTag');
        this.props.navigator.push({...TagEdit.route});
    }

    onTagPress(tag) {
        log('onTagPress');
        this.props.navigator.push({...TagEdit.route, data: tag});
    }

    componentDidMount() {
        log('componentDidMount');
        this._isMounted = true;
        const store = this.store;
        this.unsubscribe = store.subscribe(() => {
            log('setState');
            const tagState = store.getState().tag;
            this.setState({dataSource: this.ds.cloneWithRows(tagState.items), isLoading: tagState.isLoading});
        });
        store.dispatch(loadTags());
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this._isMounted = false;
        this.unsubscribe();
        if (this.state.isLoading) {
            this.store.dispatch(cancelLoadTags());
        }
    }
}
