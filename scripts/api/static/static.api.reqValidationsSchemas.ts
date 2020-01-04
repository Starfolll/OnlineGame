import Joi from "joi";

export const staticApiRequestValidationSchemas = {
    userLoginSchema: {
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).required()
    },
    userSignUpSchema: {
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(8).max(255).required(),
        publicName: Joi.string().min(2).max(255).required(),
        name: Joi.string().min(2).max(255).required(),
    }
};