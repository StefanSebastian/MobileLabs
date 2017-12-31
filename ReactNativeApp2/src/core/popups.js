import {Alert} from 'react-native';

export function displayAlert(title, message, action){
    Alert.alert(
        title,
        message,
        [
            {text: 'OK', onPress: action},
        ],
        { cancelable: false }
    );
}