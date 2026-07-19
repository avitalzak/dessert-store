import express from "express"; 
import OrderController from "../Controllers/orders.controller.js"
import { optionalAuth, requireAuth, requireAdmin } from "../middlewares/Middleware.js";

const OrderRouter = express.Router()

OrderRouter.get('/', requireAuth, requireAdmin, OrderController.getOrders)
OrderRouter.get('/myOrders', requireAuth, OrderController.getOrdersByUserId)
OrderRouter.delete('/deleteOrder/:id', OrderController.deleteOrder)
OrderRouter.post('/addOrder', optionalAuth, OrderController.addOrder)
OrderRouter.put('/updateOrder/:id', requireAuth, requireAdmin, OrderController.updateOrder)



export default OrderRouter 
