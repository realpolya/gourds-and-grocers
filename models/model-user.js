import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: {
        type: Array,
        default: []
    },
    total: Number, 
  });

export default mongoose.model('User', new mongoose.Schema({
    account: {
        type: String,
        enum: ['grocer', 'shopper'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    pastOrders: [orderSchema],
}));