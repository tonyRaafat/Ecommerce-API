import { Product } from "../../../database/models/product.model.js";
import { wishListModel } from "../../../database/models/wishlist.model.js";
import { throwError } from "../../utils/throwerror.js";

export const addWishList = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw throwError("product not found", 404);
    }

    let wishList = await wishListModel.findOne({ user: req.user._id });
    if (!wishList) {
      const newWishList = await wishListModel.create({
        user: req.user._id,
        products: [productId]
      });
      return res.status(201).json({ msg: "done", wishList: newWishList });
    }
    wishList.products.addToSet(productId);
    await wishList.save();

    res.status(201).json({ msg: "done", wishList });
  } catch (error) {
    next(error);
  }
};