import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL + '/api';

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

export async function spotifyLogin(token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/spotify/login',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

export async function spotifyCallback(token, query) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/spotify/callback' + `?code=${ query.code }&state=${ query.state }`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        query: query
    };

    return axios.request(config)
}

export async function getSpotifyCredentials(token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/spotify/credentials',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

export async function refreshSpotifyCredentials(token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/spotify/refresh',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

export async function setPlaybackDevice(token, device) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback/device',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: device
    };

    return axios.request(config)
}

export async function joinPlayback(token, chatId) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback/join',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: chatId
    };

    return axios.request(config)
}

export async function quitPlayback(token, chatId) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback/quit',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: chatId
    };

    return axios.request(config)
}

export async function startResume(token, chatId) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback/start',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: chatId
    };

    return axios.request(config)
}

export async function getPlayback(token, chatId) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback/' + chatId,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    };

    return axios.request(config)
}

export async function playbackAction(token, chatId, action) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: apiUrl + '/playback',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        },
        data: { 'chat_id': chatId,
            'action': action,
        }
    };

    return axios.request(config)
}