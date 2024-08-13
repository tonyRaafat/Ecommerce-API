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
        versionKey: false,
        toJSON:{virtuals:true}
    }
)

categorySchema.virtual('subCategory',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'category'
})

export const Category = model('category', categorySchema);