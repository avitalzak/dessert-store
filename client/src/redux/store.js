import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./Slice/productSlice";
import cartReducer from "./Slice/cartSlice";
import categoriesReducer from "./Slice/categorySlice";
import userReducer from "./Slice/userSlice"
import ordersReducer from "./Slice/ordersSlice"
import favoritesReducer from "./Slice/favoritesSlice"


export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        categories: categoriesReducer,
        user: userReducer,
        orders: ordersReducer,
        favorites: favoritesReducer,
    }
});