import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
    label: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
    image: String
}, { _id: false })

const stepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    multiSelect: { type: Boolean, default: false },
    minSelect: { type: Number, default: 0 },
    maxSelect: { type: Number, default: 1 },
    options: [optionSchema]
}, { _id: false })

const Product = mongoose.models.Product || mongoose.model(
    "Product",
    new mongoose.Schema({
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: String,
        image: String,
        categorySlug: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        type: { type: String, enum: ['simple', 'buildable'], required: true },
        steps: { type: [stepSchema], default: [] },
        active: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now }
    }, { collection: "products" })
)

export default Product

