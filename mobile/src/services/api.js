import axios from 'axios';

const API_URL = 'http://192.168.1.6:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;