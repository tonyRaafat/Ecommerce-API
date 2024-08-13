import mongoose, { Types } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment is required"],
      minLength: 3,
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "rate is required"],
      min: 1,
      max: 5,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const reviewModel = mongoose.model("review", reviewSchema);
