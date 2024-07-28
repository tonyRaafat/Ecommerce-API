import mongoose, { Types } from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: 3,
    maxLength:30,
    trim: true,
    unique: true,
    lowercase: true
  },
  slug:{
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
    unique: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "user",
    required: true
  },
  image: {
    secure_url:String,
    public_id: String
  },
  customeId:{
    type: String,
    minLength: 5,
    maxLength: 5,
  },
});

const Brand = mongoose.model("brand",brandSchema)
export default Brand