import { Router } from "express";
import * as enrollmentController from './Enrollment.controller.js'
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Enrollment.role.js";
import { asyncHandler } from "../../Utils/CatchError.js";
import validation from "../../Middelware/Validation.js";
import {
    enrollStudentSchema,
    getEnrolledStudentsForSpecificInstructorSchema,
    getEnrolledStudentsSchema,
    getMyStudentsSchema,
    unenrollFromCourseSchema,
    updateProgressSchema
} from "./Enrollment.validation.js";

const router = Router({ mergeParams: true });

router.post('/',
    asyncHandler(auth(endPoints.enroll)),
    asyncHandler(validation(enrollStudentSchema)),
    asyncHandler(enrollmentController.enrollStudent));

router.get('/',
    asyncHandler(auth(endPoints.getEnrolledStudents)),
    asyncHandler(validation(getEnrolledStudentsSchema)),
    asyncHandler(enrollmentController.getEnrolledStudents));

router.get('/myStudents',
    asyncHandler(auth(endPoints.getMyStudents)),
    asyncHandler(validation(getMyStudentsSchema)),
    asyncHandler(enrollmentController.getMyStudents));

router.get('/:instructorId',
    asyncHandler(auth(endPoints.getEnrolledStudents)),
    asyncHandler(validation(getEnrolledStudentsForSpecificInstructorSchema)),
    asyncHandler(enrollmentController.getEnrolledStudentsForSpicificInstructor));

router.delete('/',
    asyncHandler(auth(endPoints.delete)),
    asyncHandler(validation(unenrollFromCourseSchema)),
    asyncHandler(enrollmentController.unenrollFromCourse))

router.patch('/:lessonId',
    asyncHandler(auth(endPoints.update)),
    asyncHandler(validation(updateProgressSchema)),
    asyncHandler(enrollmentController.updateProgress));


export default router;