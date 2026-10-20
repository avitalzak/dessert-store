import axios from "axios";
import api from "./token";
import { API_URL } from "./config";

export const getCategories = () => {
    return axios.get(`${API_URL}/categories`)
}

export const addCategory = (categoryData) => {
    return api.post(`/categories/addCategory`, categoryData)
}

export const deleteCategory = (id) => {
    return api.delete(`/categories/deleteCategory/${id}`)
}