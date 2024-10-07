import mongoose from "mongoose";

// cartItem schema
const cartItemSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

export default mongoose.model('Cart', new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}));