export const serverUrl = 'http://192.168.43.253:3000';
export const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
export const authHeaders = (token) => ({...headers, 'Authorization': `Bearer ${token}`});