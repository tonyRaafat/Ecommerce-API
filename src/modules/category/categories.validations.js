import joi from 'joi';
import { generalField } from '../../utils/generalFields.js';

export const createCategorySchema = {
    body: joi.object({
        name: joi.string().required(),
    }),
    file: generalField.file,
    headers: generalField.headers
};

export const updateCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30)
    }),
    params: joi.object({
        id: joi.string().hex().required()
    }),
    image: generalField.file,
    headers: generalField.headers.required()
}