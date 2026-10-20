import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./Slice/productSlice";
import cartReducer, { GUEST_CART_KEY } from "./Slice/cartSlice";
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

// אורח: העגלה נשמרת ב-localStorage. משתמש מחובר: העגלה בשרת, ולכן מוחקים את העותק המקומי
let lastSavedItems = null
store.subscribe(() => {
    const items = store.getState().cart.items
    try {
        if (localStorage.getItem("jwtToken")) {
            localStorage.removeItem(GUEST_CART_KEY)
            lastSavedItems = null
        } else if (items !== lastSavedItems) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items || []))
            lastSavedItems = items
        }
    } catch {
        // localStorage לא זמין (למשל גלישה בסתר) - העגלה פשוט לא תישמר
    }
});