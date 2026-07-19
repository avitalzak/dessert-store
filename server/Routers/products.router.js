import express from "express"; 
import ProductController from "../Controllers/products.controller.js"
import { requireAuth, requireAdmin} from "../middlewares/Middleware.js"

const ProductRouter = express.Router()

ProductRouter.get('/', ProductController.getProducts)
ProductRouter.get('/:id', ProductController.getProductById)
ProductRouter.delete('/deleteProduct/:id', ProductController.deleteProduct)
ProductRouter.post('/addProduct', requireAuth, requireAdmin, ProductController.addProduct)
ProductRouter.put('/updateProduct/:id', requireAuth, requireAdmin, ProductController.updateProduct)



export default ProductRouter 
