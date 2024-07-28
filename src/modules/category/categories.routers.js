import { Router } from 'express';
import { auth, authorization } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import * as CC from "./categories.controllers.js";
import {  createCategorySchema, updateCategory } from './categories.validations.js';
import { multerHost, validExtension, } from '../../middlewares/multer.js';
const categoryRouter = Router();

categoryRouter.post("/", auth, authorization(["Admin"]), multerHost(validExtension.image).single("image"),validate(createCategorySchema),CC.createCategory);
categoryRouter.put("/",auth,authorization(["Admin"],multerHost(validExtension.image).single("image"),validate(updateCategory),CC.updateCategory))
export default categoryRouter;

