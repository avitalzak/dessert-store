import express from "express"; 
import ShoppingCartController from "../Controllers/shoppingCart.controller.js"


const ShoppingCartRouter = express.Router()


console.log("SHOPPING CART ROUTES FILE LOADED");

ShoppingCartRouter.stack.forEach(r => {
  console.log("ROUTE:", r.route?.path);
});

ShoppingCartRouter.get('/', ShoppingCartController.getShoppingCart)
//ShoppingCartRouter.get('/:id', ShoppingCartController.getShoppingCartById)
ShoppingCartRouter.put('/updateShoppingCart/:id', ShoppingCartController.updateShoppingCart)
ShoppingCartRouter.delete('/deleteShoppingCart/:id', ShoppingCartController.deleteShoppingCart)
ShoppingCartRouter.post('/addShoppingCart', ShoppingCartController.addShoppingCart)
ShoppingCartRouter.post("/merge", ShoppingCartController.mergeCart);


export default ShoppingCartRouter 
