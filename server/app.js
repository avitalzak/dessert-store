import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
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





const api = express.Router()

api.use('/orders', orderRouter)
api.use('/users', userRouter)
api.use('/products', productRouter)
api.use('/shoppingCart', requireAuth, ShoppingCartRouter)
api.use('/categories', categoryRouter)
api.use('/favorites', requireAuth, favoriteRouter)
api.use('/payments', PaymentRouter)
api.use('/upload', uploadRouter)

app.use('/api', api)

// serve the built React site (client/dist) and let React Router handle page routes
const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')
app.use(express.static(clientDist))
// only page routes get index.html; a missing file (e.g. /videos/x.mp4) gets a real 404 instead of the whole site
app.get(/^(?!\/api)(?!.*\.\w+$).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')))


const connectDB = async ()=>{
    
    try{
        await mongoose.connect(MONGO_URI);
        console.log("connect DB successfully!!")

        const PORT = process.env.PORT || 1234
        app.listen(PORT, ()=>{
        console.log("running server on port " + PORT)
})

    }
    catch(err){
         console.log("error"+err);
    }
}

connectDB()


