import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true ,lowercase:true},
    slug: { type: String, required: true, unique: true },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    customId:String
},
    {
        timestamps: true,
        versionKey: false
    }
)

export const Category = model('category', categorySchema);