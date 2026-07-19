import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteProduct, getProducts, addProduct } from "../../API/productsAPI"


export const GetProducts = createAsyncThunk(
    "products/get",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProducts()
            return response.data
        }
        catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


export const DeleteProduct = createAsyncThunk(
    "products/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteProduct(id)
            return id
        }
        catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


export const AddProduct = createAsyncThunk(
    "products/add",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await addProduct(productData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    products: [],

    // המוצר שכרגע בתהליך בנייה (כולל steps שלו מהסכמה)
    selectedProduct: null,

    // באיזה step אנחנו עכשיו (אינדקס במערך steps של selectedProduct)
    currentStepIndex: 0,

    selections: {},

    loading: false,
    error: null,
    success: false,
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {

        setProducts: (state, action) => {
            state.products = action.payload
        },

        // מתחיל תהליך בנייה למוצר buildable
        startBuild: (state, action) => {
            state.selectedProduct = action.payload
            state.currentStepIndex = 0
            state.selections = {}
        },

        goToNextStep: (state) => {
            //אם השלב הנוכחי קטן ממספר השלבים במערך המוצר הנוכחי אפשר לעבור לשלב הבא
            if (state.selectedProduct && state.currentStepIndex < state.selectedProduct.steps.length - 1) {
                state.currentStepIndex += 1
            }
        },
        //שלב אחד אחורה
        goToPrevStep: (state) => {
            if (state.currentStepIndex > 0) {
                state.currentStepIndex -= 1
            }
        },

        // בוחר/מבטל אופציה בstep הנוכחי, בהתאם ל-multiSelect של אותו step
        toggleOption: (state, action) => {
            const { stepIndex, option } = action.payload
            const step = state.selectedProduct.steps[stepIndex]
            //התוספות שנבחרו עכשיו
            const current = state.selections[stepIndex] || []
             //עובר לבדוק אם התוספת נמצאת בשלב בנוכחי של המוצר הנוכחי
            const exists = current.some(o => o.label === option.label)

            if (exists) {
                state.selections[stepIndex] = current.filter(o => o.label !== option.label)
            } 
            else {
                if (step.multiSelect) {
                    if (current.length < step.maxSelect) {
                        state.selections[stepIndex] = [...current, option]
                    }
                } else {
                   //מחליף את הבחירה הקיימת
                    state.selections[stepIndex] = [option]
                }
            }
        },

        clearSelections: (state) => {
            state.selectedProduct = null
            state.currentStepIndex = 0
            state.selections = {}
        },

    },


    extraReducers: (builder) => {
        builder
            .addCase(GetProducts.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })

            .addCase(GetProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.success = true;
            })

            .addCase(GetProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            })

            .addCase(AddProduct.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })

            .addCase(AddProduct.fulfilled, (state, action) => {
                state.loading = false
                state.products.push(action.payload)
                state.success = true
            })
            .addCase(AddProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Something went wrong"
            })

            .addCase(DeleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
                state.success = true;
            })
            .addCase(DeleteProduct.rejected, (state, action) => {
                state.error = action.payload;
            });
    }

})

export const {
    setProducts,
    startBuild,
    goToNextStep,
    goToPrevStep,
    toggleOption,
    clearSelections
} = productsSlice.actions

export default productsSlice.reducer