import joi from 'joi';
import { generalFields } from '../../Middelware/Validation.js';

export const registerSchema = {
    body: joi.object({
        userName: joi.string().min(3).max(20).required().messages({
            'string.empty': 'userName is required',
            'string.min': 'userName must be at least 3 characters long',
            'string.max': 'userName cannot be more than 20 characters long'
        }),
        email: generalFields.email,
        password: generalFields.password,
        cpassword: joi.valid(joi.ref('password')).required().messages({
            'any.only': 'passwords must match'
        }),
        role: joi.string().valid('Instructor', 'Student').required().messages({
            'any.only': 'role must be either Instructor or Student ',
            'string.empty': 'role is required'
        }),
    })
}

export const loginSchema = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password,
    })
}

export const sendCodeSchema = {
    body: joi.object({
        email: generalFields.email,
    })
}

export const forgotPasswordSchema = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password,
        code: joi.string().length(6).required().messages({
            "string.length": "code must be 6 characters long",
        })
    })
}
