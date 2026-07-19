import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addCategory, deleteCategory, getCategories } from "../../API/categoriesAPI"

export const GetCategories = createAsyncThunk(
    "categories/get",
    async (_, { rejectWithValue }) => {
        try {
        const response = await getCategories();
        return response.data
    }
    catch (error) {
        return rejectWithValue(error.message)
    }
  }
)

export const DeleteCategory = createAsyncThunk(
    "categories/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCategory(id)
            return id
        }
        catch(error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)



export const AddCategory = createAsyncThunk(
    "categories/add",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await addCategory(categoryData)
            return response.data
        } 
        catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const initialState = {
    categories: [],
    loading: false,
    error: null,
    success: false,
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(GetCategories.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })

            .addCase(GetCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload
                state.success = true
            })

            .addCase(GetCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Something went wrong"
                state.success = false
            })

            .addCase(AddCategory.pending, (state) => {
                    state.loading = true
                    state.error = null
                    state.success = false
            })
            
            .addCase(AddCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categories.push(action.payload)
                state.success = true
            })
            .addCase(AddCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Something went wrong"
            })
    
            .addCase(DeleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(p => p._id !== action.payload);
                state.success = true;
            })
            .addCase(DeleteCategory.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
})

export const { } = categoriesSlice.actions
export default categoriesSlice.reducer