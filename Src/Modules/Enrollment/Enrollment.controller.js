import CourseModel from "../../../DB/Models/Course.model.js";
import enrollmentModel from "../../../DB/Models/Enrollment.model.js";
import userModel from "../../../DB/Models/User.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";

export const enrollStudent = async (req, res, next) => {
    const { courseId } = req.params;
    const { instructorId } = req.body;
    const studentId = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const instructor = await userModel.findOne({ _id: instructorId, role: 'Instructor' });
    if (!instructor) {
        return next(new AppError("Instructor not found", 404));
    }
    if (!course.instructors.includes(instructorId)) {
        return next(new AppError("Instructor is not assigned to this course", 400));
    }
    const existingEnrollment = await enrollmentModel.findOne({ studentId, courseId });
    if (existingEnrollment) {
        return next(new AppError("Student is already enrolled in this course", 400));
    }
    const newEnrollment = await enrollmentModel.create({
        studentId,
        courseId,
        instructorId,
        enrollmentDate: new Date(),
        status: 'Enrolled'
    });
    return next(new AppSuccess("success", 201, { enrollment: newEnrollment }));
}

export const getEnrolledStudents = async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const enrollments = await enrollmentModel.find({ courseId })
        .populate({
            path: 'studentId',
            select: 'userName'
        });
    if (!enrollments.length) {
        return next(new AppError("No students enrolled in this course.", 404))
    }
    const students = enrollments.map(enrollment => enrollment.studentId);
    return next(new AppSuccess("success", 200, { students }));
}

export const getMyStudents = async (req, res, next) => {
    const { courseId } = req.params;
    const instructorId = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    if (!course.instructors.includes(instructorId)) {
        return next(new AppError("You are not authorized to access students for this course", 403));
    }
    const enrollments = await enrollmentModel.find({ courseId })
        .populate({
            path: 'studentId',
            select: 'userName'
        });
    if (!enrollments.length) {
        return next(new AppError("No students enrolled in this course.", 404))
    }
    const students = enrollments.map(enrollment => enrollment.studentId);
    return next(new AppSuccess("success", 200, { students }));
}

export const getEnrolledStudentsForSpicificInstructor = async (req, res, next) => {
    const { courseId, instructorId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const instructor = await userModel.findById(instructorId);
    if (!instructor) {
        return next(new AppError("Instructor not found", 404));
    }
    if (!course.instructors.includes(instructorId)) {
        return next(new AppError("This instructor is not assigned to this course", 403));
    }
    const enrollments = await enrollmentModel.find({ courseId, instructorId }).populate({
        path: 'studentId',
        select: 'userName'
    });
    if (enrollments.length === 0) {
        return next(new AppError("No students found for this instructor in this course.", 404));
    }
    const students = enrollments.map(enrollment => enrollment.studentId);
    return next(new AppSuccess("success", 200, { students }));
}

export const unenrollFromCourse = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const enrollment = await enrollmentModel.findOne({ courseId, studentId });
    if (!enrollment) {
        return next(new AppError("You are not enrolled in this course", 400));
    }
    await enrollmentModel.deleteOne({ courseId, studentId });
    const instructorId = enrollment.instructorId;
    await enrollmentModel.updateMany(
        { courseId, instructorId },
        { $pull: { students: studentId } }
    );
    return next(new AppSuccess("success", 200));
};

