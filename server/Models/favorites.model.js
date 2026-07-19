import mongoose from 'mongoose'
import Item from './items.model.js'


const Favorite = mongoose.models.Favorite || mongoose.model(
    "Favorite",
    new mongoose.Schema({
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        items: [Item]
}, {collection:"favorites"})
)

export default Favorite