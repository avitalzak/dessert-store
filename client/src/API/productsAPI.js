import axios from "axios";
import api from "./token";


export const getProducts = () => {
    return axios.get(`http://localhost:1234/products`)
}

export const addProduct = (productData) => {
    return api.post(`http://localhost:1234/products/addProduct`, productData)
}

export const deleteProduct = (id) => {
    return api.delete(`http://localhost:1234/products/deleteProduct/${id}`)
}

