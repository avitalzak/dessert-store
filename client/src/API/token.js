import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:1234',
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api