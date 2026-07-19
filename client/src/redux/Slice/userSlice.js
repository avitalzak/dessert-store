import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUsers, getMe, login, register } from "../../API/userAPI";
import { clearCart } from "./cartSlice";


export const LoginUser = createAsyncThunk(
    "user/login",
    async (user, { rejectWithValue }) => {
        try {
            const response = await login(user)
            localStorage.setItem("jwtToken", response.data.token)
            return response.data.user
        }
        catch(error) {
            return rejectWithValue(error.message)
        }
    }
)

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            localStorage.removeItem("jwtToken");
            dispatch(clearCart());
            dispatch(setSignOut());
        } catch (error) {
            return rejectWithValue("שגיאה בהתנתקות");
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await register(userData)
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    "user/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMe()
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            console.log("1. מנסה לפנות ל-API...");
            const response = await getAllUsers(); // הפונקציה שקוראת לשרת
            console.log("2. קיבלתי תשובה מהשרת:", response);
            return response.data;
        } catch (err) {
            console.log("3. ה-API נכשל, הנה השגיאה:", err);
            return rejectWithValue(err.response?.data?.message || "שגיאה בטעינת משתמשים");
        }
    }
)


const initialState = {
    user: null,
    usersList: [],
    isSignIn: false,
    loading: true,
    error: null,
    success: false
}

const userSlice = createSlice ({
    name: "user",
    initialState,
    reducers: {
        
        setSignOut : (state) => {
            state.user = null
            state.isSignIn = false
            state.usersList = []
            state.loading = false
            state.error = null
            state.success = false            
         }

    },

    extraReducers: (builder) => {
    builder
        .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            // 2. טיפול גנרי ב-Rejected (כל שגיאה)
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    // טיפול מיוחד ל-fetchCurrentUser אם צריך
                    if (action.type === fetchCurrentUser.rejected.type) {
                        state.user = null;
                        state.isSignIn = false;
                        localStorage.removeItem("jwtToken");
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false;
                    
                    if (action.type === LoginUser.fulfilled.type || action.type === fetchCurrentUser.fulfilled.type) {
                        state.user = action.payload;
                        state.isSignIn = true;
                    } 
                    else if (action.type === registerUser.fulfilled.type) {
                        state.success = true;
                    } 
                    else if (action.type === fetchAllUsers.fulfilled.type) {
                        state.usersList = action.payload;
                    }
                }
            );
}
})

export const {setSignOut} = userSlice.actions;
export default userSlice.reducer;