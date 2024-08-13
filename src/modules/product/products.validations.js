import joi from "joi";
import { generalField } from "../../utils/generalFields.js";

export const createProduct = {
    body: joi.object({
        title: joi.string().min(3).max(30).required(),
        stock: joi.number().min(1).integer().required(),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer().required(),
        brand: joi.string().hex().required(),
        subCategory: joi.string().hex().required(),
        category: joi.string().hex().required(),
        description: joi.string().required()
    }),
    files: joi.object({
        image: joi.array().items(generalField.file.required()).required(),
        coverImages: joi.array().items(generalField.file.required()).required()
    }).required(),
    headers: generalField.headers.required()
}

export const updateProduct = {
    body: joi.object({
        name: joi.string().min(3).max(30),
        stock: joi.number().min(1).integer(),
        discount: joi.number().min(1).max(100),
        price: joi.number().min(1).integer(),
        brand: joi.string().hex().required(),
        subCategory: joi.string().hex().required(),
        category: joi.string().hex().required(),
        description: joi.string()
    }),
    params: joi.object({
        id: joi.string().hex().required(),
    }),
    files: joi.object({
        image: joi.array().items(generalField.file),
        coverImages: joi.array().items(generalField.file)
    }),
    headers: generalField.headers.required()
}