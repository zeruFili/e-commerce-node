const joi = require('joi');

const signupSchema = {
  body: joi.object().keys({
    first_name: joi.string().min(1).required(),
    last_name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone_number: joi.string().required(),
  }),
};

const loginSchema = {
  body: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),
};

const forgotPasswordSchema = {
  body: joi.object().keys({
    email: joi.string().email().required(),
  }),
};

const resetPasswordSchema = {
  body: joi.object().keys({
    password: joi.string().min(6).required(),
  }),
};

const verifyEmailSchema = {
  body: joi.object().keys({
    code: joi.string().required(),
  }),
};

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};