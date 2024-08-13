import express from "express";
import { validate } from "../../middlewares/validate.js";
import { auth } from "../../middlewares/auth.js";
import * as WC from './wishList.controllers.js'
import * as WV from './wishList.validations.js'
const router = express.Router();

router.post("/",validate(WV.addWishList), auth, WC.addWishList);

export default router
