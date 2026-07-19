import express from 'express'
import cors from "cors"
import mongoose from 'mongoose'
import { MONGO_URI } from './config.js'
import dotenv from "dotenv"
import uploadRouter from './Routers/upload.router.js'

import orderRouter from './Routers/orders.router.js'
import userRouter from './Routers/users.router.js'
import categoryRouter from './Routers/categories.router.js'
import favoriteRouter from './Routers/favorites.router.js'
import productRouter from './Routers/products.router.js'
import PaymentRouter from './Routers/payments.router.js'
import { optionalAuth,  requireAuth} from './middlewares/Middleware.js'
import ShoppingCartRouter from './Routers/shoppingCart.router.js'







dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())





app.use('/orders', orderRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/shoppingCart', requireAuth, ShoppingCartRouter)
app.use('/categories', categoryRouter)
app.use('/favorites', requireAuth, favoriteRouter)
app.use('/payments', PaymentRouter)
app.use('/upload', uploadRouter)


const connectDB = async ()=>{
    
    try{
        await mongoose.connect(MONGO_URI);
        console.log("connect DB successfully!!")

        app.listen(1234, ()=>{
        console.log("running server")
})

    }
    catch(err){
         console.log("error"+err);
    }
}

connectDB()


