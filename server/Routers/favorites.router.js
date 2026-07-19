import express from "express"; 
import FavoriteController from "../Controllers/favorites.controller.js"

const FavoriteRouter = express.Router()

FavoriteRouter.get('/', FavoriteController.getFavorites)
FavoriteRouter.get('/:id', FavoriteController.getFavoriteById)
FavoriteRouter.delete('/deleteFavorite/:id', FavoriteController.deleteFavorite)
FavoriteRouter.post('/addFavorite', FavoriteController.addFavorite)
FavoriteRouter.put('/updateFavorite/:id', FavoriteController.updateFavorite)


export default FavoriteRouter 
