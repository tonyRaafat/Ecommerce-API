import joi from 'joi';
import { generalField } from "../../utils/generalFields.js";

export const createOrder = {
    body: joi.object({
        productId: joi.string().hex(),
        quantity: joi.number().integer(),
        phone: joi.string().required(),
        address: joi.string().required(),
        couponCode: joi.string().min(3),
        paymentMethod: joi.string().valid("card", "cash").required()
    }),
    headers: generalField.headers.required()
}

export const cancleOrder = {
    body: joi.object({
        reason: joi.string().min(3)
    }),
    params: joi.object({
        id: joi.string().hex().required()
    }).required(),
    headers: generalField.headers.required()
}