import Order from '../Models/orders.model.js'
import Payment from '../Models/payments.model.js'
import User from '../Models/users.model.js'
import ShoppingCart from '../Models/shoppingCart.model.js'
import Product from '../Models/products.model.js'

const OrderController = {


    getOrders: async (req, res) => {
        try {
            if (!req.user || !req.user.roles?.includes("admin")) {
                return res.status(403).json({ message: "Access denied" })
            }
            
            const orders = await Order.find()
                .populate('userId', 'firstName lastName email')
                .lean()
    
            const formattedOrders = orders.map(order => ({
                ...order,
                customerName: order.userId 
                    ? `${order.userId.firstName} ${order.userId.lastName}` 
                    : "לקוח לא רשום",
                customerEmail: order.userId?.email || null
            }))
    
            res.status(200).json(formattedOrders)
        } 
        catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    deleteOrder: async (req, res) => {
        const id = req.params.id;
        try {
            const order = await Order.findById(id);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const userId = req.user?.userId || req.user?._id;
            const isOwner = order.userId && userId && order.userId.toString() === userId.toString();
            const isAdmin = req.user?.roles?.includes("admin");

            if (!req.user || (!isAdmin && !isOwner)) {
                return res.status(403).json({ message: "Access denied" });
            }

            await Order.findByIdAndDelete(id);
            const orders = await Order.find({});
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }  
    },

   
    getOrderById: async (req, res) => {
        try {
            const id = req.params.id;
            const order = await Order.findById(id);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const userId = req.user?.userId || req.user?._id;
            const isOwner = order.userId && userId && order.userId.toString() === userId.toString();
            const isAdmin = req.user?.roles?.includes("admin");

            if (!req.user || (!isAdmin && !isOwner)) {
                return res.status(403).json({ message: "Access denied" });
            }

            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    addOrder: async (req, res) => {
        const userId = req.user?.userId || req.user?._id || null;
        const { items, type, method } = req.body;

        try {
            if (!items || items.length === 0) {
                return res.status(400).json({ message: "No items in order" });
            }

            let totalPrice = 0;

            for (const clientItem of items) {
                const product = await Product.findById(clientItem.productId || clientItem._id);

                if (!product) {
                    return res.status(400).json({ message: `Product not found: ${clientItem.name || clientItem.productId}` });
                }

                let itemPrice = product.price;

                if (clientItem.components && clientItem.components.length > 0) {
                    for (const comp of clientItem.components) {
                        const step = product.steps?.find(s => s.title === comp.stepTitle);
                        const option = step?.options?.find(o => o.label === comp.label);

                        if (!option) {
                            return res.status(400).json({ message: `Invalid option: ${comp.label}` });
                        }

                        itemPrice += option.priceDelta || 0;
                    }
                }

                const quantity = clientItem.quantity && clientItem.quantity > 0 ? clientItem.quantity : 1;
                totalPrice += itemPrice * quantity;
            }

            if (userId) {
                const user = await User.findById(userId);

                if (user && user.birthDate) {
                    const today = new Date();
                    const birthDate = new Date(user.birthDate);

                    const isBirthday = today.getDate() === birthDate.getDate() &&
                                       today.getMonth() === birthDate.getMonth();

                    if (isBirthday) {
                        totalPrice = totalPrice * 0.9;
                        console.log(`הוחלה הנחת יום הולדת! המחיר החדש: ${totalPrice}`);
                    }
                }
            }

            const newOrder = new Order({
                userId,
                items,
                totalPrice,
                type,
                status: "pending"
            });
        
            await newOrder.save();
        
            const payment = await Payment.create({
                orderId: newOrder._id,
                paidAt: new Date(),
                status: "pending",
                paymentNumber: Date.now(),   
                paymentMethod: method 
            });

            newOrder.paymentId = payment._id;
            await newOrder.save();

            if (userId) {
                await ShoppingCart.findOneAndDelete({ userId: userId })
            }
        
            res.status(201).json(newOrder);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },


    updateOrder: async (req, res) => {
        const id = req.params.id;
        const { status, type } = req.body;
    
        try {
            if (!req.user || !req.user.roles?.includes("admin")) {
                return res.status(403).json({ message: "Access denied" });
            }
    
            const findOrder = await Order.findById(id);
    
            if (!findOrder) {
                return res.status(404).json({ message: "Order not found" });
            }
    
            if (status !== undefined) findOrder.status = status;
            if (type !== undefined) findOrder.type = type;
            
            await findOrder.save();
    
            const update = await Order.find({})
                .populate('userId', 'firstName lastName email')
                .lean();
    
            const formattedOrders = update.map(order => ({
                ...order,
                customerName: order.userId 
                    ? `${order.userId.firstName} ${order.userId.lastName}` 
                    : "לקוח לא רשום"
            }));
    
            res.status(200).json(formattedOrders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    

    getOrdersByUserId: async (req, res) => {
        try {
            const userId = req.user?.userId || req.user?._id;
            
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const orders = await Order.find({ userId });
    
            res.status(200).json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    }
};

export default OrderController;