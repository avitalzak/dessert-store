import Favorite from '../Models/favorites.model.js'
import Item from '../Models/items.model.js'

const FavoriteController = {

    getFavorites: async (req, res) => {
        try {
            const userId = req.user.userId
            const favorites = await Favorite.findOne({ userId })
                
    
            res.status(200).json(favorites);
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    deleteFavorite: async (req, res) => {
     try {
         const itemId = req.params.id;
         const userId = req.user.userId;
 
         const updated = await Favorite.findOneAndUpdate(
             { userId },
             { $pull: { items: { _id: itemId } } },
             { new: true }
         )
         res.status(200).json(updated);
        }
      catch (err) {
         res.status(500).json({ error: err.message });
        }
    },

    getFavoriteById: async (req, res) => {
        try {
            const id = req.params.id;
            const favorite = await Favorite.findById(id)
            

            if (!favorite) {
                return res.status(404).json({ message: "Favorite not found" })
            }

            res.status(200).json(favorite)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    addFavorite: async (req, res) => {
        console.log("req.user:", req.user)
        const userId = req.user.userId
        const { item } = req.body  // מקבלים מנה בודדת
        console.log("item שהתקבל:", JSON.stringify(item)) 
    
        try {
            let favorites = await Favorite.findOne({ userId })
    
            if (!favorites) {
                favorites = new Favorite({ userId, items: [item] })
            } else {
                favorites.items.push(item)
            }
    
            await favorites.save()
            res.status(201).json(favorites)
        } 
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    updateFavorite: async (req, res) => {
        const id = req.params.id
        const { items } = req.body
    
        try {
            const updated = await Favorite.findByIdAndUpdate(
                id,
                { items },
                { new: true }
            )
    
            if (!updated) {
                return res.status(404).json({ message: "Favorite not found" })
            }
    
            res.status(200).json(updated)
        }
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default FavoriteController;