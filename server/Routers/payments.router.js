import express from "express"; 
import PaymentController from "../Controllers/payments.controller.js"
import { requireAdmin, requireAuth } from "../middlewares/Middleware.js";

const PaymentRouter = express.Router()

PaymentRouter.get('/', requireAuth, requireAdmin, PaymentController.getPayments)
PaymentRouter.get('/:id', requireAuth, requireAdmin, PaymentController.getPaymentById)
PaymentRouter.delete('/deletePayment/:id', requireAuth, requireAdmin, PaymentController.deletePayment)
PaymentRouter.post('/addPayment', requireAuth, requireAdmin, PaymentController.addPayment)
PaymentRouter.put('/updatePayment/:id', requireAuth, requireAdmin, PaymentController.updatePayment)


export default PaymentRouter 
