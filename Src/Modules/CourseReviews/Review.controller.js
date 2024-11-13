import CourseModel from "../../../DB/Models/Course.model.js";
import CourseReviewModel from "../../../DB/Models/CourseReviews.model.js";
import enrollmentModel from "../../../DB/Models/Enrollment.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";


export const createCourseReview = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.id;
    const { rating, comment } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const enrollment = await enrollmentModel.findOne({ courseId, studentId });
    if (!enrollment) {
        return next(new AppError("Student is not enrolled in this course", 403));
    }
    if (enrollment.progress < 100) {
        return next(new AppError("You need to complete the course to submit a review", 400));
    }
    const existingReview = await CourseReviewModel.findOne({ courseId, studentId });
    if (existingReview) {
        return next(new AppError("You have already reviewed this course", 400));
    }
    const review = await CourseReviewModel.create({
        studentId,
        courseId,
        rating,
        comment
    });

    const reviews = await CourseReviewModel.find({ courseId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    course.averageRating = averageRating;
    await course.save();
    return next(new AppSuccess("success", 201, { review }));
};

export const deleteCourseReview = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.id;
    const review = await CourseReviewModel.findOne({ courseId, studentId });
    if (!review) {
        return next(new AppError("Review not found or you are not authorized to delete this review", 404));
    }
    await CourseReviewModel.deleteOne({ _id: review._id });
    const remainingReviews = await CourseReviewModel.find({ courseId });
    const averageRating = remainingReviews.length > 0
        ? remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length
        : 0;
    await CourseModel.findByIdAndUpdate(courseId, { averageRating });
    return next(new AppSuccess("success", 200));
};

