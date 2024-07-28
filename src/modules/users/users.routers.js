import express from 'express';
import { deleteUser, forgotPassword, getOtherUsersData, getUserData, login, register, resetPassword, updatePassword, updateUser, verifyOtp } from './users.controllers.js';
import { validate } from '../../middlewares/validate.js';
import { forgotPasswordValidation, loginValidation, otpValidation, registerValidation, resetPasswordValidation, updatePasswordValidation, updateUservalidation } from './users.validations.js';
import { auth } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/register',validate(registerValidation), register);
router.post('/verifyOtp',validate(otpValidation),verifyOtp)
router.post('/forgot-password',validate(forgotPasswordValidation),forgotPassword)
router.post('/reset-password',validate(resetPasswordValidation),resetPassword)
router.post('/login', validate(loginValidation),login);

router.get('/', auth ,getUserData);
router.get('/:id', auth,getOtherUsersData)

router.put('/', auth ,validate(updateUservalidation),updateUser);
router.put('/update-password', auth,validate(updatePasswordValidation),updatePassword );
  
router.delete('/', auth ,deleteUser);



export default router;