const Joi = require('joi');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).max(16).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).max(16).required(),
});

const userSchemas = {
    registerSchema,
    loginSchema,
};

module.exports = userSchemas;
