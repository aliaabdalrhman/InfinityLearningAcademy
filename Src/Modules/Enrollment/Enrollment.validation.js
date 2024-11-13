import { generalFields } from "../../Middelware/Validation.js";
import joi from "joi";

export const enrollStudentSchema = {
    params: joi.object({
        courseId: generalFields.id,
    }),
    body: joi.object({
        instructorId: generalFields.id
    })
};

export const getEnrolledStudentsSchema = {
    params: joi.object({
        courseId: generalFields.id,
    }),
};

export const getEnrolledStudentsForSpecificInstructorSchema = {
    params: joi.object({
        courseId: generalFields.id,
        instructorId: generalFields.id
    })
};

export const getMyStudentsSchema = {
    params: joi.object({
        courseId: generalFields.id,
    }),
};

export const unenrollFromCourseSchema = {
    params: joi.object({
        courseId: generalFields.id,
    }),
};

export const updateProgressSchema = {
    params: joi.object({
        courseId: generalFields.id,
        lessonId: generalFields.id
    })
};
