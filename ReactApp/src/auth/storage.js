import {AsyncStorage} from 'react-native';
import {getLogger} from "../core/utils";

const USER = 'user';
const SERVER = 'server';

const log = getLogger('auth/storage');

export const readUser = async() => await read(USER);
export const saveUser = async(user) => await save(USER, user);
export const readServer = async() => await read(SERVER);
export const saveServer = async(server) => await save(SERVER, server);

export const save = async(key, object) => {
    log(`save ${key}`);
    await AsyncStorage.setItem(key, JSON.stringify(object));
};

export const read = async(key) => {
    log(`read ${key}`);
    return JSON.parse(await AsyncStorage.getItem(key));
};