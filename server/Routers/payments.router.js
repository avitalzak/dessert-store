import express from "express"; 
import PaymentController from "../Controllers/payments.controller.js"
import { optionalAuth, requireAdmin, requireAuth } from "../middlewares/Middleware.js";

const PaymentRouter = express.Router()

PaymentRouter.get('/', requireAuth, requireAdmin, PaymentController.getPayments)
PaymentRouter.get('/:id', PaymentController.getPaymentById)
PaymentRouter.delete('/deletePayment/:id', PaymentController.deletePayment)
PaymentRouter.post('/addPayment', optionalAuth, PaymentController.addPayment)
PaymentRouter.put('/updatePayment/:id', PaymentController.updatePayment)


export default PaymentRouter 
