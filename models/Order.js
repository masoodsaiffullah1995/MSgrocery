import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",           // must match Product model name
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "user",
  },

  items: {
    type: [orderItemSchema],
    required: true,
    validate: (v) => Array.isArray(v) && v.length > 0,
  },

  amount: {
    type: Number,
    required: true,
  },

  // reference to Address document (so you can populate and get fullName, etc.)
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "Order Placed",
  },

  date: {
    type: Number, // timestamp (ms)
    required: true,
  },
});

const Order =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
