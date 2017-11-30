import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export class TagView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.listItem}>{this.props.tag.name}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        margin: 10,
    }
});