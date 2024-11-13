import CourseModel from "../../../DB/Models/Course.model.js";
import enrollmentModel from "../../../DB/Models/Enrollment.model.js";
import LessonModel from "../../../DB/Models/Lesson.model.js";
import lessonReviewModel from "../../../DB/Models/LessonReviews.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";

export const createReviewOnLesson = async (req, res, next) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.id;
    const { rating, comment } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const lesson = await LessonModel.findOne({ _id: lessonId, courseId });
    if (!lesson) {
        return next(new AppError("Lesson not found", 404));
    }
    const enrollment = await enrollmentModel.findOne({ courseId, studentId });
    if (!enrollment) {
        return next(new AppError("Student is not enrolled in this course", 403));
    }
    const existingReview = await lessonReviewModel.findOne({ lessonId, studentId });
    if (existingReview) {
        return next(new AppError("You have already reviewed this lesson", 400));
    }
    const review = await lessonReviewModel.create({
        studentId,
        lessonId,
        courseId,
        rating,
        comment
    });
    const reviews = await lessonReviewModel.find({ lessonId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    lesson.averageRating = averageRating;
    await lesson.save();

    return next(new AppSuccess("success", 201, { review }));
};

export const deleteLessonReview = async (req, res, next) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.id;
    const review = await lessonReviewModel.findOne({ courseId, lessonId, studentId });
    if (!review) {
        return next(new AppError("Review not found", 404));
    }
    if (review.studentId.toString() !== studentId.toString()) {
        return next(new AppError("You are not authorized to delete this review", 403));
    }
    await lessonReviewModel.deleteOne({ _id: review._id });
    const remainingReviews = await lessonReviewModel.find({ lessonId });
    const averageRating = remainingReviews.length > 0
        ? remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length
        : 0;
    await LessonModel.findByIdAndUpdate(lessonId, { averageRating });
    return next(new AppSuccess("success", 200));
};


