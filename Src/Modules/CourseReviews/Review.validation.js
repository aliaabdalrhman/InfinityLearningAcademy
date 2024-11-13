import { generalFields } from "../../Middelware/Validation.js";
import joi from "joi";

export const createReviewSchema = {
    body: joi.object({
        comment: joi.string().required().min(3),
        rating: joi.number().min(1).max(5).required(),
    }),
    params: joi.object({
        courseId: generalFields.id,
    })
}

export const deleteReviewSchems = {
    params: joi.object({
        courseId: generalFields.id,
    })
}