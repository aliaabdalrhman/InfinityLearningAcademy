import { generalFields } from "../../Middelware/Validation.js";
import joi from "joi";

export const createCourseSchema = {
    body: joi.object({
        name: generalFields.name,
        description: joi.string().optional(),
        price: joi.number().optional(),
        categories: joi.string().required(),
        level: joi.string().valid('Beginner', 'Intermediate', 'Advanced').messages({
            'any.only': 'status must be either Beginner ,Intermediate or Advanced',
            'string.empty': 'status is required'
        }),
    })
}

export const assignInstructorSchema = {
    body: joi.object({
        instructorId: generalFields.id
    }),
    params: joi.object({
        courseId: generalFields.id
    })
}

