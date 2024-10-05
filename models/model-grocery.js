import mongoose from "mongoose";

export default mongoose.model('Grocery', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    listed: {
        type: Boolean,
        required: true,
        default: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    image: String,
    info: String,
    from: String,
    resupplied: {
        type: Boolean,
        required: true,
    },
    frequency: Number,
    halloween: {
        type: Boolean,
        required: true,
    }
}));