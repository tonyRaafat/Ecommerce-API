import { Coupon } from "../../../database/models/coupon.model.js"
import { throwError } from "../../utils/throwerror.js"

export const createCoupon = async (req, res, next) => {
  try {
    const { code, amount, fromDate, toDate } = req.body

    const couponExist = await Coupon.findOne({ code: code.toLowerCase() })
    if (couponExist) {

      throw throwError("coupon already exist", 409)
    }
    const coupon = await Coupon.create(
      {
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id
      })
    return res.status(201).json({ msg: "done", coupon })
  } catch (error) {
    next(error)
  }
}

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params
    const { code, amount, fromDate, toDate } = req.body
    const coupon = await couponModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      {
        code,
        amount,
        fromDate,
        toDate
      }, {
      new: true
    })
    if (!coupon) {
      throw throwError("coupon not exist or you don't have permission", 409)
    }
    res.status(200).json({ msg: "done", coupon })
  } catch (error) {
    next(error)
  }
}