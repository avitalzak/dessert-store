import ShoppingCart from '../Models/shoppingCart.model.js'
//לוגיקה למציאת מוצר עם בדיוק אותם תכונות!!
const normalizeComponents = (components = []) =>
    JSON.stringify(
        [...components]
            .map(c => ({ label: c.label, priceDelta: c.priceDelta || 0 }))
            .sort((a, b) => a.label.localeCompare(b.label))
    ) 

const ShoppingCartController = {

    getShoppingCart: async (req, res) => {
        const userId = req.user?.userId 
        try {
            const cart = await ShoppingCart.findOne({ userId }) 
            res.status(200).json(cart?.items || []) 
        } catch (err) {
            res.status(500).json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" }) 
        }
    },

    deleteShoppingCart: async (req, res) => {
        const itemId = req.params.id 
        const userId = req.user?.userId 

        try {
            const cart = await ShoppingCart.findOneAndUpdate(
                { userId },
                { $pull: { items: { _id: itemId } } },
                { new: true }
            ) 

            res.status(200).json(cart?.items || []) 
        } catch (err) {
            res.status(500).json({ error: err.message }) 
        }
    },

    
    addShoppingCart: async (req, res) => {
        const userId = req.user?.userId 
        const incomingItem = req.body 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - no user" }) 
        }

        const itemToSave = {
            productId: incomingItem.productId,
            name: incomingItem.name,
            price: incomingItem.price,
            image: incomingItem.image,
            quantity: incomingItem.quantity || 1,
            components: incomingItem.components || []
        } 

        try {
            let cart = await ShoppingCart.findOne({ userId }) 
            if (!cart) {
                cart = new ShoppingCart({ userId, items: [itemToSave] }) 
            } else {
                const newSignature = normalizeComponents(itemToSave.components) 

                const existing = cart.items.find(item =>
                    item.name === itemToSave.name &&
                    normalizeComponents(item.components) === newSignature
                ) 

                if (existing) {
                    existing.quantity += itemToSave.quantity  
                } else {
                    cart.items.push(itemToSave) 
                }
            }
            await cart.save() 

            const updatedCart = await ShoppingCart.findOne({ userId }) 
            res.status(200).json(updatedCart.items) 

        } catch (err) {
            res.status(500).json({ error: err.message }) 
        }
    },

    updateShoppingCart: async (req, res) => {
        const itemId = req.params.id 
        const userId = req.user?.userId 
        const { type } = req.body 

        try {
            const cart = await ShoppingCart.findOne({ userId }) 

            if (!cart) {
                return res.status(404).json({ message: "ShoppingCart not found" }) 
            }

            const itemIndex = cart.items.findIndex(d => String(d._id) === String(itemId)) 
            if (itemIndex === -1) {
                return res.status(404).json({ message: "Item not found in cart" }) 
            }

            if (type === "inc") {
                cart.items[itemIndex].quantity += 1 
            } else if (type === "dec") {
                if (cart.items[itemIndex].quantity > 1) {
                    cart.items[itemIndex].quantity -= 1 
                }
            } else {
                return res.status(400).json({ message: "Invalid type" }) 
            }

            await cart.save() 

            const updatedCart = await ShoppingCart.findOne({ userId }) 
            res.status(200).json(updatedCart.items) 
        } catch (err) {
            res.status(500).json({ error: err.message }) 
        }
    },

    mergeCart: async (req, res) => {
        const userId = req.user?.userId 
        const { guestCart } = req.body 

        try {
            let cart = await ShoppingCart.findOne({ userId }) 
            if (!cart) {
                cart = new ShoppingCart({ userId, items: [] }) 
            }

            guestCart.forEach(guestItem => {
                const guestSignature = normalizeComponents(guestItem.components) 

                const existing = cart.items.find(item =>
                    item.name === guestItem.name &&
                    normalizeComponents(item.components) === guestSignature
                ) 

                if (existing) {
                    existing.quantity += guestItem.quantity 
                } else {
                    cart.items.push({
                        productId: guestItem.productId,
                        name: guestItem.name,
                        price: guestItem.price,
                        image: guestItem.image,
                        quantity: guestItem.quantity || 1,
                        components: guestItem.components || []
                    }) 
                }
            }) 

            await cart.save() 

            const updatedCart = await ShoppingCart.findOne({ userId }) 
            res.status(200).json(updatedCart.items) 
        } catch (err) {
            res.status(500).json({ error: err.message }) 
        }
    }
} 

export default ShoppingCartController 