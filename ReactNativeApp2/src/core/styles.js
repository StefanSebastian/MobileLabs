import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    content: {
        marginTop: 70,
    },
    button: {
        paddingTop: 20,
    },
    text: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: "center"
    },
    textInput: {
        fontSize: 20,
        paddingTop: 10,
        height: 50,
        marginLeft: 10,
        marginRight: 10
    },
    listItem: {
        margin: 10,
    },
    cardContent: {
        fontSize: 20,
        paddingTop: 10
    },
    tagSaveView: {
        backgroundColor: "white",
        marginTop: 40,
        marginBottom: 40,
        padding: 10
    },
    tagItemView: {
        backgroundColor: "white",
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 10,
        borderRadius: 2,
        borderColor: '#b9c0cc',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 2,
        },
    }
});