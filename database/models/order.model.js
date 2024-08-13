import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  products: [{
    title: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    subPrice: { type: Number, required: true }
  }],
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["card", "cash"]
  },
  status: {
    type: String,
    enum: ["placed", "waitPayment", "delivered", "onway", "cancelled", "rejected"],
    default: "placed"
  },
  canceledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  reason: { type: String }
}, {
  timestamps: true,
  versionKey: false
});

export const OrderModel = mongoose.model("Order", orderSchema);