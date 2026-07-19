import api from "./token"

export const getFavorites = () => {
    return api.get('/favorites')
}

export const addFavorite = (item) => {
    return api.post('/favorites/addFavorite', { item })
}

export const removeFavorite = (itemId) => {
    console.log("removeFavorite API נקרא עם:", itemId)
    return api.delete(`/favorites/deleteFavorite/${itemId}`)
}

