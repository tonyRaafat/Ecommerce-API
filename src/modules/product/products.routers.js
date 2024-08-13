import express from 'express';
import { auth, authorization } from '../../middlewares/auth.js';
import { multerHost, validExtension, } from '../../middlewares/multer.js';
import { validate } from '../../middlewares/validate.js';
import * as PC from '../product/products.controllers.js' 
import * as PV from '../product/products.validations.js' 

const router = express.Router({caseSensitive:true});

router.post("/", auth, authorization(["Admin"]), multerHost(validExtension.image).fields([
    {name:"image",maxCount:1},
    {name:"coverImages", maxCount:3}
]), validate(PV.createProduct),PC.createProduct);

router.put('/:id',auth,authorization(["Admin"]),multerHost(validExtension.image).fields([
    {name:"image",maxCount:1},
    {name:"coverImages", maxCount:3}
]),validate(PV.updateProduct),PC.updateProduct);

router.get('/',PC.getProducts)

export default router;

