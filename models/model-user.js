import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: {
        type: Array,
        default: [] // array of objects, each object has the structure:
        // { id: value, seller: name of seller, name: name of item, quantity: quantity of item, price: price of item, total: price * quantity };
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