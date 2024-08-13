import express from 'express';
import { auth, authorization } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as CC from "./categories.controllers.js";
import {  createCategorySchema, updateCategory } from './categories.validations.js';
import { multerHost, validExtension, } from '../../middlewares/multer.js';
const router = express.Router({caseSensitive:true});

router.post("/", auth, authorization(["Admin"]), multerHost(validExtension.image).single("image"),validate(createCategorySchema),CC.createCategory);

router.put('/:id',auth,authorization(["Admin"]),multerHost(validExtension.image).single("image"),validate(updateCategory),CC.updateCategory);

router.get('/',CC.getCategories)

router.delete('/:id',auth,authorization(["Admin"]),CC.deleteCategory)
export default router;

