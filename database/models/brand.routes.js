import express from "express";
import * as BC from "../controllers/brand.js";
import * as BV from "../validations/brand.js";
import { multerHost, validExtension } from "../middleware/multer.js";
import { validation } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import { systemRoles } from "../service/systemRoles.js";

const router = express.Router();

router
  .route("/create")
  .post(
    multerHost(validExtension.image).single("image"),
    validation(BV.createBrand),
    auth([systemRoles.admin]),
    BC.createbrand
  );

router
  .route("/update/:id")
  .put(
    multerHost(validExtension.image).single("image"),
    validation(BV.updateBrand),
    auth([systemRoles.admin]),
    BC.updatebrand
  );

router
  .route("/get")
  .get(
    auth(),
    BC.getbrands
  );

router
  .route("/delete")
  .delete(
    auth([systemRoles.admin]),
    validation(BV.deleteBrand),
    BC.deletebrand
  );

export default router;
