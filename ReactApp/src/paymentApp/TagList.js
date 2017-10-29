import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import styles from '../core/styles';
import { httpApiUrl, wsApiUrl } from '../core/api';
import { getLogger, issueToText } from '../core/utils';
import { TagView } from "./TagView";

const log = getLogger('TagList');

export class TagList extends Component {
    ws = null;

    constructor(props) {
        super(props);
        log('constructor');
        this.state = { isLoading: false, issue: null, tags: null };
    }

    render() {
        log('render');
        const { isLoading, issue, tags } = this.state;
        log(tags);
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
        this.setState({ isLoading: true });
        fetch(`${httpApiUrl}/tag`)
            .then(response => response.json())
            .then(responseJson => this.setState({ tags: responseJson.tags, isLoading: false }))
            .catch(error => this.setState({ issue: { error: error.message }, isLoading: false }));
        this.connectWs();
    }

    componentWillUnmount() {
        log('componentWillUnmount');
    }

    onNewTag(e) {
        const tag = JSON.parse(e.data).tag;
        let { tags } = this.state;
        this.setState({
            tags: tags ? tags.concat([tag]) : [tag]
        });
    }

    connectWs() {
        ws = new WebSocket(wsApiUrl);
        ws.onopen = () => log('onopen');
        ws.onmessage = this.onNewTag.bind(this);
        ws.onerror = e => log(e.message);
        ws.onclose = e => log(e.code)
    }
}