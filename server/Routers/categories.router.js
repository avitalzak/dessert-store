import express from "express"; 
import CategoryController from "../Controllers/categories.controller.js"
import { requireAuth, requireAdmin} from "../middlewares/Middleware.js"

const CategoryRouter = express.Router()

CategoryRouter.get('/', CategoryController.getCategories)
CategoryRouter.get('/:id', CategoryController.getCategoryById)
CategoryRouter.delete('/deleteCategory/:id', requireAuth, requireAdmin, CategoryController.deleteCategory)
CategoryRouter.post('/addCategory', requireAuth, requireAdmin, CategoryController.addCategory)
CategoryRouter.put('/updateCategory/:id', requireAuth, requireAdmin, CategoryController.updateCategory)


export default CategoryRouter 
