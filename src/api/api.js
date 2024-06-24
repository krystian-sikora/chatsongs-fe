import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export async function register(email, username, password) {

    let data = JSON.stringify({
        "email": email,
        "username": username,
        "password": password
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/auth/register',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        data: data
    };

    return axios.request(config)
}

export async function login(email, password) {

    let data = JSON.stringify({
        "email": email,
        "password": password
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/auth/authenticate',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        data: data
    };

    return axios.request(config)
}

export async function refresh(token) {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/auth/refresh',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

export async function getChats(token) {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/chat',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

// field users is an array of user id's to be added to new chat
export async function createChat(token, users) {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/chat',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: users
    };

    return axios.request(config)
}

export async function addContact(token, userId) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/contact',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: userId
    };

    return axios.request(config)
}

export async function getContacts(token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/contact',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}