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
};

export const assignInstructorSchema = {
    body: joi.object({
        instructorIds: joi.array().items(generalFields.id)
    }),
    params: joi.object({
        courseId: generalFields.id
    })
};

export const getCourseDetailsSchema = {
    params: joi.object({
        id: generalFields.id,
    })
};

export const updateCourseSchema = {
    body: joi.object({
        name: generalFields.name,
        status: generalFields.status,
        description: joi.string().optional(),
    }),
    params: joi.object({
        id: generalFields.id,
    })
};

export const deleteCourseSchema = {
    params: joi.object({
        id: generalFields.id,
    })
};
