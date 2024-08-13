import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, unique: true },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String
    }],
    category: {
        type: Types.ObjectId,
        ref: "category",
        required: true
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    brand: {
        type: Types.ObjectId,
        ref: "Brand",
        required: true
    },
    customId: String,
    price: {
        type: Number,
        required: true,
        min: 1
    },
    subPrice:{
        type:Number,
        default:1
    },
    discount: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    rateAvg: {
        type: Number,
        default: 0,
        
    },

},
    {
        timestamps: true,
        versionKey: false
    }
)

export const Product = model('Product', productSchema);