import joi from 'joi';
import { generalField } from '../../utils/generalFields.js';

export const addWishList = {
    params: joi.object({
        productId: joi.string().hex().required(),
    }),
    headers: generalField.headers.required()
}