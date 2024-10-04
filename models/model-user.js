import mongoose from "mongoose";

// TODO: finish past order schema
const pastOrder = new mongoose.Schema({
    company: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    notes: String,
    postingLink: String,
    status: {
      type: String,
      enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted'],
      required: true,
    }
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