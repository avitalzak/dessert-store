import Category from '../Models/categories.model.js'
import Product from '../Models/products.model.js'

const CategoryController = {

    getCategories: async (req, res) => {
        try {
            const categories = await Category.find({})
            res.status(200).json(categories)
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    },


    deleteCategory: async (req, res) => {
    const id = req.params.id

        try {
            const category = await Category.findById(id)
    
            if (!category) {
                return res.status(404).json({ message: "Category not found" })
            }
    
            const productsCount = await Product.countDocuments({ categorySlug: category.slug })
    
            if (productsCount > 0) {
                return res.status(400).json({ 
                    message: "לא ניתן למחוק את הקטגוריה - קיימים בה מוצרים" 
                })
            }
    
            await Category.findByIdAndDelete(id)
            const categories = await Category.find({})
            res.json(categories)
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },


    getCategoryById: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.findById(id)

            if (!category) {
                return res.status(404).json({ message: "Category not found" })
            }

            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    addCategory: async (req, res) => {
        try {
            const { name, order, active, image } = req.body
            
            const slug = `${name.toString().trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

            const newCategory = new Category({ slug, name, order, active, image })

            await newCategory.save()

            res.status(201).json(newCategory)
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    updateCategory: async (req, res) => {
        const id = req.params.id
        const { slug, name, order, active, image } = req.body

        try {
            const findCategory = await Category.findById(id)

            if (!findCategory) {
                return res.status(404).json({ message: "Category not found" })
            }

            if (slug !== undefined) findCategory.slug = slug
            if (name !== undefined) findCategory.name = name
            if (order !== undefined) findCategory.order = order
            if (active !== undefined) findCategory.active = active
            if (image !== undefined) findCategory.image = image

            await findCategory.save()

            const update = await Category.find({})

            res.status(200).json(update)
        }
        catch (err) {
            res.status(500).json({ error: err })
        }
    }

}

export default CategoryController