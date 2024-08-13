import { OrderModel } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import { reviewModel } from "../../../database/models/review.model.js";
import { throwError } from "../../utils/throwerror.js";

export const createReview = async (req, res, next) => {
  try {
    const { comment, rate } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw throwError("product not found", 404);
    }

    const reviewExist = await reviewModel.findOne({ createdBy: req.user._id, productId });
    if (reviewExist) {
      throw throwError("you already placed your review", 400);
    }

    const order = await OrderModel.findOne({
      user: req.user._id,
      "products.productId": productId,
      status: "delivered"
    });
    if (!order) {
      throw throwError("you cannot review on product you didn't order", 400);
    }

    const review = await reviewModel.create({
      comment,
      rate,
      productId,
      createdBy: req.user._id
    });

    let sum = product.rateAvg * product.rateNum;
    sum += rate;

    product.rateAvg = sum / (product.rateNum + 1);
    product.rateNum += 1;
    await product.save();

    return res.status(200).json({ msg: "done", review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await reviewModel.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!review) {
      throw throwError("review doesn't exist", 404);
    }

    const product = await Product.findById(review.productId);

    let sum = product.rateAvg * product.rateNum;
    sum -= review.rate;

    product.rateAvg = sum / (product.rateNum - 1);
    product.rateNum -= 1;
    await product.save();

    res.status(204).json({ msg: "done" });
  } catch (error) {
    next(error);
  }
};