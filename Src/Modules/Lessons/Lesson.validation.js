import { generalFields } from "../../Middelware/Validation.js";
import joi from "joi";

export const createLessonSchema = {
    body: joi.object({
        title: generalFields.name,
        description: joi.string().optional(),
        instructorId: generalFields.id,
        order: joi.number().required(),
        startTime: joi.date().required(),
        duration: joi.number().positive(),
        link: joi.string().required(),
    }),
    params: joi.object({
        courseId: generalFields.id,
    })
};

export const getLessonsForSpecificInstructorSchema = {
    body: joi.object({
        instructorId: generalFields.id,
    }),
    params: joi.object({
        courseId: generalFields.id,
    })
};

export const getLessonDetailsSchema = {
    params: joi.object({
        courseId: generalFields.id,
        lessonId: generalFields.id
    })
};

export const updateLessonSchema = {
    body: joi.object({
        description: joi.string().optional(),
        link: joi.string().optional(),
        status: generalFields.status,

    }),
    params: joi.object({
        courseId: generalFields.id,
        lessonId: generalFields.id,
    })
};

export const deleteLessonSchema = {
    params: joi.object({
        courseId: generalFields.id,
        lessonId: generalFields.id
    })
};
