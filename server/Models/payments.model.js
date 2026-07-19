import mongoose from 'mongoose'


const Payment = mongoose.models.Payment || mongoose.model(
    "Payment",
    new mongoose.Schema(
          {
            orderId: { type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true},
            paidAt: { type: Date, default: Date.now, required: true },
            status: { type: String, required: true },
            paymentNumber: { type: Number, required: true },
            paymentMethod: {type: String, required: true },
            transactionId: {type: Number }
}, {collection:"payments"})
);

export default Payment


