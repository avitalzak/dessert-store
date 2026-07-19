import Product from '../Models/products.model.js'
import Category from '../Models/categories.model.js'

const ProductController = {

    getProducts: async (req, res) => {
        try {
            const products = await Product.find({})
            res.status(200).json(products)
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params
            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ id: id })
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },


    getProductById: async (req, res) => {
        try {
            const id = req.params.id;
            const product = await Product.findById(id)

            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }

            res.status(200).json(product)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    addProduct: async (req, res) => {
        try {
            const { name, description, image, categoryId, price, type, steps, active } = req.body
    
            const category = await Category.findById(categoryId)
    
            if (!category) {
                return res.status(404).json({ error: "קטגוריה לא נמצאה" })
            }
    
            const slug = `${name.toString().trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
            const newProduct = new Product({
                slug,
                name,
                description,
                image,
                categorySlug: category.slug,
                price,
                type,
                steps,
                active
            })
    
            await newProduct.save()
    
            res.status(201).json(newProduct)
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    updateProduct: async (req, res) => {
        const id = req.params.id
        const { slug, name, description, image, categorySlug, price, type, steps, active } = req.body

        try {
            const findProduct = await Product.findById(id)

            if (!findProduct) {
                return res.status(404).json({ message: "Product not found" })
            }

            findProduct.slug = slug
            findProduct.name = name
            findProduct.description = description
            findProduct.image = image
            findProduct.categorySlug = categorySlug
            findProduct.price = price
            findProduct.type = type
            findProduct.steps = steps
            findProduct.active = active

            await findProduct.save()

            const update = await Product.find({})

            res.status(200).json(update)
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }

}

export default ProductController;
