import Joi from "joi";

export const joiUserSchema = Joi.object({
  name: Joi.string(),
  username: Joi.string().alphanum().min(3).max(20),
  phoneNumber: Joi.number().min(10),
  email: Joi.string().email(),
  password: Joi.string().required(),
});
export const joiPropertySchema = Joi.object({
  name:Joi.string(),
  category: Joi.string(),
  address: Joi.string(),
  place: Joi.string(),
  price: Joi.string(),
  bedrooms: Joi.number(),
  bathrooms: Joi.number(),
  size: Joi.number(),
  description:Joi.string(),
  type:Joi.string(),
  images: Joi.array().items(Joi.string()),
});
