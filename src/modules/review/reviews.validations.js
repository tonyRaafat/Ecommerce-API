import joi from 'joi';
import { generalField } from '../../utils/generalFields.js';

export const createReview = {
    body: joi.object({
        rate: joi.number().min(1).max(5).integer().required(),
        comment: joi.string().required()
    }),
    params: joi.object({
        productId: joi.string().hex().required(),
    }),
    headers: generalField.headers.required()
}

export const deleteReview = {
    params: joi.object({
        id: joi.string().hex().required(),
    }),
    headers: generalField.headers.required()
}