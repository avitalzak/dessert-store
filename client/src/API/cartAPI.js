import api from "./token"

export const getCartAPI = () => {
    return api.get('/shoppingCart')
}

export const addCartItemAPI = (item) => {
    return api.post('/shoppingCart/addShoppingCart', item)
}

export const removeCartItemAPI = (id) => {
    return api.delete(`/shoppingCart/deleteShoppingCart/${id}`)
}

export const updateCartItemAPI = ({ id, type }) => {
    return api.put(`/shoppingCart/updateShoppingCart/${id}`, { type })
}

export const mergeCartAPI = (guestCart) => {
    return api.post("/shoppingCart/merge", { guestCart })
}


