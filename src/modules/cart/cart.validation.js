import joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createCart = {
    body: joi.object({
        productId: generalField.id.required(),
        quantity: joi.number().integer().required(),
    }),
    headers: generalField.headers.required()
}

export const removeCart = {
    body: joi.object(
        {
            productId: generalField.id.required(),
        }
    ),
    headers: generalField.headers.required()
}

export const clearCart = {
    headers: generalField.headers.required()
}