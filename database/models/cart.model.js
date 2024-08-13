import mongoose, { Types } from "mongoose"

const cartSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }],
}, {
    timestamps: true,
    versionKey: false,
})
export const cartModel = mongoose.model("cart", cartSchema)
