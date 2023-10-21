import Joi from "joi";

const registrasiValidation = Joi.object({
  email: Joi.string().email().min(1).max(100).required(),
  password: Joi.string().min(1).required(),
  level: Joi.string().valid("pengunjung", "admin").required(),
  username: Joi.string().min(1).max(100).required(),
  gender: Joi.string().valid("female", "male").required(),
  address: Joi.string().min(1).max(100).required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().min(1).max(100).required(),
  password: Joi.string().min(1).required(),
});

const logoutValidation = Joi.number().positive().min(1).required();

export { registrasiValidation, loginValidation, logoutValidation };
