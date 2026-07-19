import mongoose from 'mongoose'


const Category = mongoose.models.Category || mongoose.model(
    "Category",
    new mongoose.Schema({
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: { type: String, default: "" },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
}, {collection:"categories"})
)

export default Category
