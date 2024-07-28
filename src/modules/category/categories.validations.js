import joi from 'joi';
import { generalField } from '../../utils/generalFields.js';

export const createCategorySchema = joi.object({
  name: joi.string().required(),
  slug: joi.string().required(),
  createdBy: joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  file:generalField.file.required(),
  headers:generalField.headers.required()
});

export const updateCategory = {
    body: joi.object({
        name: joi.string().min(3).max(30)
    }),
    params: joi.object({
        id: joi.string().hex().required()
    }),
    file: generalField.file,
    headers: generalField.headers.required()
}