import axios from "axios";
import api from "./token";

export const getCategories = () => {
    return axios.get('http://localhost:1234/categories')
}

export const addCategory = (categoryData) => {
    return api.post(`/categories/addCategory`, categoryData)
}

export const deleteCategory = (id) => {
    return api.delete(`/categories/deleteCategory/${id}`)
}