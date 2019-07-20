import joi from 'joi';

export const productSchema = joi.object().keys({
  categoryId: joi.string().length(36).required(),
  name: joi.string().min(3).required()
});
