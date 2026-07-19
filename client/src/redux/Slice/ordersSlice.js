import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' 
import { getMyOrders, getAllOrders, addOrder, updateOrder } from "../../API/ordersAPI" 


export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyOrders() 
            return response.data 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "שגיאה בטעינת ההזמנות שלי") 
        }
    }
) 

export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllOrders() 
            return response.data 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "שגיאה בטעינת כל ההזמנות") 
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status, type }, { rejectWithValue }) => {
        try {
            const response = await updateOrder(id, { status, type })
            return response.data
        }
        catch (err) {
            return rejectWithValue(err.response?.data?.message || "שגיאה בעדכון ההזמנה")
        }
    }
)

export const addOrderServer = createAsyncThunk(
    'orders/addOrder',
    async (newOrderData, { rejectWithValue }) => {
        try {
            const response = await addOrder(newOrderData) 
            return response.data 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "שגיאה בהוספת ההזמנה") 
        }
    }
) 


// export const deleteOrderServer = createAsyncThunk(
//     'orders/deleteOrder',
//     async (id, { rejectWithValue }) => {
//         try {
//             await deleteOrder(id) 
//             return id 
//         } catch (err) {
//             return rejectWithValue(err.response?.data?.message || "שגיאה במחיקת ההזמנה") 
//         }
//     }
// ) 

const initialState = {
    ordersList: [],
    selectedOrder: null,
    loading: false,
    error: null,
    success: false,
} 

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        selectOrderById: (state, action) => {
            const orderId = action.payload 
            state.selectedOrder = state.ordersList.find(order => order._id === orderId) || null 
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null 
        },
        clearOrders: (state) => {
            state.ordersList = [] 
            state.selectedOrder = null 
            state.loading = false 
            state.error = null 
        }
    },

    extraReducers: (builder) => {  
        builder
            .addMatcher(
                (action) => action.type.startsWith('orders/') && action.type.endsWith('/pending'),
                (state) => { state.loading = true;  state.error = null  }
            )
            .addMatcher(
                (action) => action.type.startsWith('orders/') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false 
    
                    if (action.type === fetchMyOrders.fulfilled.type 
                        || action.type === fetchOrders.fulfilled.type
                        || action.type === updateOrderStatus.fulfilled.type) {
                        state.ordersList = action.payload 
                    }
                    else if (action.type === addOrderServer.fulfilled.type) {
                        state.ordersList.push(action.payload) 
                    }
                    // else if (action.type === deleteOrderServer.fulfilled.type) {
                    //     state.ordersList = state.ordersList.filter(order => order._id !== action.payload) 
                    // }
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('orders/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false 
                    state.error = action.payload 
                }
            )
    }
}) 

export const { selectOrderById, clearSelectedOrder, clearOrders } = ordersSlice.actions
export default ordersSlice.reducer