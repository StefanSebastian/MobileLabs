import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import styles from '../core/styles';
import { getLogger, issueToText } from '../core/utils';
import { TagView } from "./TagView";
import { connectWs, loadTags, disconnectWs } from "./service";

const log = getLogger('TagList');

export class TagList extends Component {
    constructor(props) {
        super(props);
        log('constructor');
        this.state = {};
    }

    render() {
        log('render');
        const { isLoading, issue, tags } = this.state;
        const issueMessage = issueToText(issue);
        return (
            <View style={styles.content}>
                <ActivityIndicator animating={isLoading} style={styles.activityIndicator} size="large"/>
                {issueMessage && <Text>{issueMessage}</Text>}
                {tags && tags.map(tag => <TagView key={tag.id} tag={tag}/>)}
            </View>
        );
    }

    componentDidMount() {
        log('componentDidMount');
        const { store } = this.props;
        store.dispatch(loadTags());
        this.unsubscribe = store.subscribe(() => {
           const { isLoading, tags, issue } = store.getState().tag;
           this.setState({ isLoading, tags, issue });
        });
        this.ws = connectWs(store);
    }

    componentWillUnmount() {
        log('componentWillUnmount');
        this.unsubscribe();
        disconnectWs(this.ws);
    }
}