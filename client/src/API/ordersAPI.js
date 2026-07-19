import { data } from "react-router-dom";
import api from "./token";

export const addOrder = (orderData) => {
    return api.post('/orders/addOrder', orderData)
}

export const getMyOrders = () => {
    return api.get('/orders/myOrders')
}

export const getAllOrders = () => {
    return api.get('/orders')
}

export const updateOrder = (id, data) => {
    return api.put(`/orders/updateOrder/${id}`, data)
}

