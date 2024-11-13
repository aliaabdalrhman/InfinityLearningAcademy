import { Router } from "express";
import * as reviewController from "./Review.controller.js"
import { asyncHandler } from "../../Utils/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Review.role.js";
import validation from "../../Middelware/Validation.js";
import { createReviewSchema, deleteReviewSchems } from "./Review.validation.js";

const router = Router({ mergeParams: true });

router.post('/',
    asyncHandler(auth(endPoints.create)),
    asyncHandler(validation(createReviewSchema)),
    asyncHandler(reviewController.createReviewOnLesson));

router.delete('/',
    asyncHandler(auth(endPoints.delete)),
    asyncHandler(validation(deleteReviewSchems)),
    asyncHandler(reviewController.deleteLessonReview));

export default router;