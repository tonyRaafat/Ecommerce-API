import express from "express";
import { validate } from "../../middlewares/validate.js";
import { auth } from "../../middlewares/auth.js";
import { authorization } from "../../middlewares/auth.js";
import * as CC from './coupon.controllers.js'
import * as CV from './coupon.validation.js'
const router = express.Router({caseSensitive:true});

router.post('/',auth,authorization(['Admin']),validate(CV.createCouponValidation),CC.createCoupon)

export default router;
