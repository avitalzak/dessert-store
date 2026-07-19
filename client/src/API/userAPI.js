import api from "./token"

export const login = (user) => {
    return api.post('/users/login', user)
}

export const register = (user) => {
    return api.post('/users/register', user)
}

export const getAllUsers = () => {
    return api.get('/users/')
}

export const getMe = () => {
    return api.get('/users/me', {
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        }
    })
}

