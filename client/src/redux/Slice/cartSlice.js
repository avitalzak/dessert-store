import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addCartItemAPI, getCartAPI, mergeCartAPI, removeCartItemAPI, updateCartItemAPI } from "../../API/cartAPI"

export const fetchCartFromServer = createAsyncThunk(
    'cart/fetchFromServer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCartAPI()
            return response.data
        } 
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const addToCartServer = createAsyncThunk(
    'cart/addToServer',
    async (item, { rejectWithValue }) => {
        try {
            await addCartItemAPI(item)
            const response = await getCartAPI()
            return response.data
        } 
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const removeFromCartServer = createAsyncThunk(
    'cart/removeFromServer',
     async (id, { rejectWithValue }) => {
        try {
            await removeCartItemAPI(id)
            const response = await getCartAPI()
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const updateQuantityServer = createAsyncThunk(
    'cart/updateQuantityServer',
     async ({ id, type }, { rejectWithValue }) => {
        try {
            await updateCartItemAPI({ id, type })
            const response = await getCartAPI()
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const mergeCartServer = createAsyncThunk(
    'cart/mergeServer',
     async (guestCart, { rejectWithValue }) => {
        try {
            const response = await mergeCartAPI(guestCart)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

// עגלת אורח נשמרת בדפדפן כדי שלא תימחק ברענון
export const GUEST_CART_KEY = "guestCart"

const loadGuestCart = () => {
    try {
        if (localStorage.getItem("jwtToken")) return []
        const saved = JSON.parse(localStorage.getItem(GUEST_CART_KEY))
        return Array.isArray(saved) ? saved : []
    } catch {
        return []
    }
}

const initialState = {
    items: loadGuestCart(),
    status: 'idle',
    loading: false,
    error: null,
    success: null
}

// נירמול רכיבי פריט להשוואה: ממיינים לפי label כדי שסדר הלחיצות של המשתמש לא ישפיע
const normalizeComponents = (item) =>
    JSON.stringify(
        [...(item.components || [])]
            .map(c => ({ label: c.label, priceDelta: c.priceDelta || 0 }))
            .sort((a, b) => a.label.localeCompare(b.label))
    )

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : []
        },
        addToCart: (state, action) => {
            console.log("addToCart called", action.payload);
            console.log("state", state)
            console.log("state.items", state.items)
            const items = state.items || []
            const newItem = action.payload
            const newSignature = normalizeComponents(newItem)

            // בדיקה האם פריט זהה (אותו שם + אותם רכיבים בדיוק) כבר קיים בעגלה
            const existing = state.items.find(item =>
                item.name === newItem.name &&
                normalizeComponents(item) === newSignature
            )

            if (existing) {
                existing.quantity += newItem.quantity
            } else {
                state.items.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    _id: crypto.randomUUID() // מייצרים _id אחיד גם לאורח
                })
            }
            state.items = items
            console.log("items after add:", state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(i => i._id !== action.payload)
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(i => i._id === action.payload)
            if (item) item.quantity += 1
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find(i => i._id === action.payload)
            if (item && item.quantity > 1) {
                item.quantity -= 1
            }
        },
        clearCart: (state) => {
            state.items = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartFromServer.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload || []
            })
            .addCase(addToCartServer.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload || []
            })
            .addCase(mergeCartServer.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload || []
            })
            .addCase(removeFromCartServer.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload || []
            })
            .addCase(updateQuantityServer.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload || []
            })
            .addMatcher(
                (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading'
                    state.error = null
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed'
                    const payload = action.payload
                    state.error = typeof payload === 'string'
                        ? payload
                        : payload?.message || payload?.error || action.error.message
                }
            )
    }

})

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer