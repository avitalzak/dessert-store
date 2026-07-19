import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getFavorites, addFavorite, removeFavorite } from '../../API/favoritesAPI'

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchAll',
     async (_, { rejectWithValue }) => {
        try {
            const res = await getFavorites()
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const addToFavorites = createAsyncThunk(
    'favorites/add',
    async (item, { rejectWithValue }) => {
        try {
            await addFavorite(item)
            const res = await getFavorites()
            return res.data
        } 
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

export const removeFromFavorites = createAsyncThunk(
    'favorites/remove',
    async (itemId, { rejectWithValue }) => {
        try {
            console.log("removeFromFavorites נקרא עם:", itemId)
            await removeFavorite(itemId)
            const res = await getFavorites()
            return res.data
        } 
        catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
})

const initialState = {
    favorites: null,
    loading: false,
    error: null,
    success: false,
}

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    extraReducers: (builder) => {
    builder
       

        .addMatcher(
                (action) => action.type.startsWith('favorites/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
     
            .addMatcher(
                (action) => action.type.startsWith('favorites/') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false;
                    state.favorites = action.payload; 
                    state.success = true;
                }
            )
           
            .addMatcher(
                (action) => action.type.startsWith('favorites/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    }
})

export default favoritesSlice.reducer