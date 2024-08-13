import joi from "joi";
import { generalField } from "../../utils/generalFields.js";
export const createSubCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30).required(),
        categoryId: joi.string().hex().required()
    }).required(),
    file: generalField.file.required(),
    headers: generalField.headers.required()
}

export const updateSubCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30),
        
    }),
    params: joi.object({
        id: joi.string().hex().required()
    }),
    file: generalField.file,
    headers: generalField.headers.required()
}

export const deleteSubCategory = {
    params: joi.object({
        id: joi.string().hex().required()
    }),
    headers: generalField.headers.required()
}