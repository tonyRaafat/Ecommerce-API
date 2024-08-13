import express from "express";
import { validate } from "../../middlewares/validate.js";
import { auth } from "../../middlewares/auth.js";
import * as RC from './reviews.controllers.js'
import * as RV from './reviews.validations.js'

const router = express.Router();

router.post("/:productId", validate(RV.createReview), auth, RC.createReview);
router.delete("/:id", validate(RV.deleteReview), auth, RC.deleteReview);

export default router