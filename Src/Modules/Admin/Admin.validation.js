import joi from 'joi';
import { generalFields } from '../../Middelware/Validation.js';

export const addAdminSchema = {
    body: joi.object({
        userName: joi.string().min(3).max(20).required().messages({
            'string.empty': 'userName is required',
            'string.min': 'userName must be at least 3 characters long',
            'string.max': 'userName cannot be more than 20 characters long'
        }),
        email: generalFields.email,
        password: generalFields.password,
    })
}

export const updateAdminSchema = {
    body: joi.object({
        email:generalFields.email.optional(),
        status:generalFields.status
    }),
    params: joi.object({
        id: generalFields.id,
    })
}

export const deleteAdminSchema = {
    params: joi.object({
        id: generalFields.id,
    })
}


