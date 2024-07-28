import express from "express";
import { multerHost, validExtension } from "../../middlewares/multer.js";
import { validate } from "../../middlewares/validate.js";
import { auth } from "../../middlewares/auth.js";
import { authorization } from "../../middlewares/auth.js";
import * as BC from './brand.controllers.js'
import { createBrand, deleteBrand, updateBrand } from "./brand.validation.js";
const router = express.Router();

router
  .route("/")
  .post(
    multerHost(validExtension.image).single("image"),
    validate(createBrand),
    auth,
    authorization(["Admin"]),
    BC.createbrand
  );
router
  .route("/:id")
  .put(
    multerHost(validExtension.image).single("image"),
    validate(updateBrand),
    auth,
    authorization(["Admin"]),
    BC.updatebrand
  );

router
  .route("/")
  .get(
    auth,
    BC.getbrands
  );

router
  .route("/delete")
  .delete(
    auth,
    authorization(["Admin"]),
    validate(deleteBrand),
    BC.deletebrand
  );

export default router;
