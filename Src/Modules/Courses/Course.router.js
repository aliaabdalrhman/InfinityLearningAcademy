import { Router } from "express";
import * as courseController from './Course.controller.js'
import { auth } from "../../Middelware/Auth.js";
import { asyncHandler } from "../../Utils/CatchError.js";
import fileUpload, { fileType } from "../../Utils/Multur.js";
import validation from "../../Middelware/Validation.js";
import { assignInstructorSchema, createCourseSchema } from "./Course.validation.js";
import { endPoints } from "./Course.role.js";


const router = Router();
router.post('/', fileUpload(fileType.image).single('image'),
    asyncHandler(auth(endPoints.create)),
    asyncHandler(validation(createCourseSchema)),
    asyncHandler(courseController.createCourse));

router.put('/:courseId/assignInstructor',
    asyncHandler(auth(endPoints.assignInstructor)),
    asyncHandler(validation(assignInstructorSchema)),
    asyncHandler(courseController.assignInstructor));

router.get('/',
    asyncHandler(auth(endPoints.get)),
    asyncHandler(courseController.getAllCourses));

router.get('/active',
    asyncHandler(courseController.getActiveCourses));

router.get('/inActive',
    asyncHandler(auth(endPoints.get)),
    asyncHandler(courseController.getInActiveCourses));

export default router;