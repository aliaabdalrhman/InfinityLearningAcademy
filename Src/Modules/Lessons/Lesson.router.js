import { Router } from "express";
import * as lessonController from './Lesson.controller.js'
import { asyncHandler } from "../../Utils/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Lesson.role.js";
import validation from "../../Middelware/Validation.js";
import {
    createLessonSchema,
    deleteLessonSchema,
    getLessonDetailsSchema,
    getLessonsForSpecificInstructorSchema,
    updateLessonSchema
} from "./Lesson.validation.js";

const router = Router({ mergeParams: true });

router.post('/', asyncHandler(auth(endPoints.create)),
    validation(createLessonSchema),
    asyncHandler(lessonController.createLesson));

router.get('/', asyncHandler(lessonController.getLessons));

router.get('/specificInstructor',
    asyncHandler(validation(getLessonsForSpecificInstructorSchema))
    , asyncHandler(lessonController.getLessonsForSpecificInstructor));

router.get('/:lessonId',
    asyncHandler(validation(getLessonDetailsSchema)),
    asyncHandler(lessonController.getLessonDetails));

router.put('/:lessonId', asyncHandler(auth(endPoints.update)),
    asyncHandler(validation(updateLessonSchema)),
    asyncHandler(lessonController.updateLesson)
);

router.delete('/:lessonId', asyncHandler(auth(endPoints.delete)),
    asyncHandler(validation(deleteLessonSchema)),
    asyncHandler(lessonController.deleteLesson));


export default router;