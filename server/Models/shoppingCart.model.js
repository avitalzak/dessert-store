import mongoose from 'mongoose'
import Item from './items.model.js';



const ShoppingCart = mongoose.models.ShoppingCart || mongoose.model(
    "ShoppingCart",
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [Item]
        
}, {collection:"shoppingcarts"})
);

export default ShoppingCart