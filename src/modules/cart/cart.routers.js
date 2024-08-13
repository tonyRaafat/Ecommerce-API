import express from 'express';
import { auth } from '../../middlewares/auth.js';
import * as CC from '../cart/cart.controller.js'
import * as CV from '../cart/cart.validation.js'
import { validate } from '../../middlewares/validate.js';
const router = express.Router({caseSensitive:true});

router.post("/", auth, validate(CV.createCart),CC.createCart);

router.patch('/',auth,validate(CV.removeCart),CC.removeCart)
router.put('/',auth,CC.clearCart)

export default router;

