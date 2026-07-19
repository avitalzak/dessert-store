import mongoose from 'mongoose'
import Item from './items.model.js';


const Order = mongoose.models.Order || mongoose.model(
    "Order",
    new mongoose.Schema(
          {userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: null},
          items: [Item],
          totalPrice: { type: Number, required: true, min: 0 },
          date: { type: Date, default: Date.now },
          status: {type: String, default: "pending"},
          type: {type: String, enum: ["dine in", "takeaway"], default: "dine in"},
          paymentId: {type: mongoose.Schema.Types.ObjectId,ref: 'Payment',required: false}         
}, {collection:"orders"})
);

export default Order