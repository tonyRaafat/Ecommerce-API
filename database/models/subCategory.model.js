import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema({
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
    category:{
        type:Types.ObjectId,
        ref:"category",
        required:true
    },
    customId:String
},
    {
        timestamps: true,
        versionKey: false
    }
)

export const SubCategory = model('SubCategory', subCategorySchema);