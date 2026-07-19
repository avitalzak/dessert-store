import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  priceDelta: { type: Number, default: 0 },
  stepTitle: { type: String, required: true }
}, { _id: false });

const Item = new mongoose.Schema({

  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },

  quantity: {
    type: Number,
    default: 1,
    min: 1
  },

  components: [componentSchema],

});

export default Item;