import {AsyncStorage} from 'react-native';
import {getLogger} from "./utils";

const log = getLogger('core/storage');

const USER = 'user';
const TOKEN = 'token';

export const readUser = async() => await read(USER);
export const saveUser = async(user) => await save(USER, user);
export const readToken = async() => await read(TOKEN);
export const saveToken = async(token) => await save(TOKEN, token);

export const save = async(key, object) => {
    log(`save ${key}`);
    await AsyncStorage.setItem(key, JSON.stringify(object));
};

export const read = async(key) => {
    log(`read ${key}`);
    return JSON.parse(await AsyncStorage.getItem(key));
};