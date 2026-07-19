import Payment from '../Models/payments.model.js'

const PaymentController = {

   
    getPayments: async (req, res) => {
        try {
            const payments = await Payment.find({});
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        } 
    },

    deletePayment: async (req, res) => {
        const id = req.params.id;
        try {
            await Payment.findByIdAndDelete(id);
            const payments = await Payment.find({});
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }  
    },

    getPaymentById: async (req, res) => {
        try {
            const id = req.params.id;
            const payment = await Payment.findById(id);

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

  
    addPayment: async (req, res) => {
        const { orderId, paidAt, status, paymentNumber, paymentMethod, transactionId } = req.body;
    
        try {
            const newPayment = new Payment({
                orderId, 
                paidAt: paidAt || new Date(), 
                status, 
                paymentNumber, 
                paymentMethod, 
                transactionId
            });
    
            await newPayment.save();
    
            const payments = await Payment.find({});
            res.status(201).json(payments);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },


    updatePayment: async (req, res) => {
        const id = req.params.id;
        const { orderId, paidAt, status, paymentNumber, paymentMethod, transactionId } = req.body;
    
        try {
            const findPayment = await Payment.findById(id);
    
            if (!findPayment) {
                return res.status(404).json({ message: "Payment not found" });
            }
    
            if (orderId !== undefined) findPayment.orderId = orderId;
            if (paidAt !== undefined) findPayment.paidAt = paidAt;
            if (status !== undefined) findPayment.status = status;
            if (paymentNumber !== undefined) findPayment.paymentNumber = paymentNumber;
            if (paymentMethod !== undefined) findPayment.paymentMethod = paymentMethod;
            if (transactionId !== undefined) findPayment.transactionId = transactionId;
            
            await findPayment.save();
    
            const update = await Payment.find({});
            res.status(200).json(update);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default PaymentController;