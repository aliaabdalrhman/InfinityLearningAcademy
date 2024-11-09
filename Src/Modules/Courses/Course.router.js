import { Router } from "express";
import * as courseController from './Course.controller.js'
import { auth } from "../../Middelware/Auth.js";
import { asyncHandler } from "../../Utils/CatchError.js";
import fileUpload, { fileType } from "../../Utils/Multur.js";
import validation from "../../Middelware/Validation.js";
import { assignInstructorSchema, createCourseSchema, deleteCourseSchema, getCourseDetailsSchema, updateCourseSchema } from "./Course.validation.js";
import { endPoints } from "./Course.role.js";
import lessonRouter from '../Lessons/Lesson.router.js'

const router = Router();

router.use('/:courseId/lessons', lessonRouter);

router.post('/', fileUpload(fileType.image).single('image'),
    asyncHandler(auth(endPoints.create)),
    asyncHandler(validation(createCourseSchema)),
    asyncHandler(courseController.createCourse));

router.put('/:courseId/assignInstructors',
    asyncHandler(auth(endPoints.assignInstructors)),
    asyncHandler(validation(assignInstructorSchema)),
    asyncHandler(courseController.assignInstructors));

router.get('/',
    asyncHandler(auth(endPoints.get)),
    asyncHandler(courseController.getAllCourses));

router.get('/active',
    asyncHandler(courseController.getActiveCourses));

router.get('/inActive',
    asyncHandler(auth(endPoints.get)),
    asyncHandler(courseController.getInActiveCourses));

router.get('/:id', validation(getCourseDetailsSchema),
    asyncHandler(courseController.getCourseDetails));

router.put('/:id', asyncHandler(auth(endPoints.update)),
    validation(updateCourseSchema),
    asyncHandler(courseController.updateCourse));

router.delete('/:id', asyncHandler(auth(endPoints.delete)),
    validation(deleteCourseSchema),
    asyncHandler(courseController.deleteCourse));

export default router;