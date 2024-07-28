import express from "express";

import * as SC from "./subCategories.controllers.js"
import { auth, authorization } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { multerHost, validExtension } from "../../middlewares/multer.js";
import { createSubCategory, updateSubCategory } from "./subCategories.validations.js";
const router = express.Router();

router
    .route("/")
    .post(
        multerHost(validExtension.image).single("image"),
        validate(createSubCategory),
        auth,
        authorization(["Admin"]),
        SC.createSubCategory
    );

router
    .route("/:id")
    .put(
        multerHost(validExtension.image).single("image"),
        validate(updateSubCategory),
        auth,
        authorization(["Admin"]),
        SC.updateSubCategory
    );

export default router;
