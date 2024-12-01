import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    studentId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamp: true
});


const CourseReviewModel = model('CourseReview', reviewSchema);

export default CourseReviewModel;