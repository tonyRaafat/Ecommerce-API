import express from "express";
import { validate } from "../../middlewares/validate.js";
import { auth } from "../../middlewares/auth.js";
import * as OV from '../order/order.validations.js'
import * as OC from '../order/order.controllers.js' 


const router = express.Router();

router.route("/").post(validate(OV.createOrder), auth, OC.createOrder);
router.route("/cancel").post(validate(OV.cancleOrder), auth, OC.cancelOrder);

router.route('/webhook').post(express.raw({type: 'application/json'}),OC.webhook);

export default router;