import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: {
        type: Array,
        default: []
    },
    total: Number, 
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
  });

export default mongoose.model('User', new mongoose.Schema({
    account: {
        type: String,
        enum: ['grocer', 'shopper'],
        required: true,
    },
    username: {
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
    activated: {
        type: Boolean,
        required: true,
        default: true
    },
    pastOrders: [orderSchema],
}));