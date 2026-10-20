import axios from "axios";
import api from "./token";
import { API_URL } from "./config";


export const getProducts = () => {
    return axios.get(`${API_URL}/products`)
}

export const addProduct = (productData) => {
    return api.post(`${API_URL}/products/addProduct`, productData)
}

export const deleteProduct = (id) => {
    return api.delete(`${API_URL}/products/deleteProduct/${id}`)
}

