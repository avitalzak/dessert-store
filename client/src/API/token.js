import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
    baseURL: API_URL,
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