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
        url: apiUrl + 'api/auth/register',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        data : data
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
        url: apiUrl + 'api/auth/authenticate',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        data : data
    };

    return axios.request(config)
}