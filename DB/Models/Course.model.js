import { model, Schema, Types } from "mongoose";

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Object,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    instructors: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    duration: {
        type: Number,
        min: 1,
        required: true


    },
    categories: [
        {
            type: String,
            required: true
        }
    ]
    ,
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

courseSchema.virtual('review', {
    ref: 'CourseReview',
    localField: '_id',
    foreignField: 'courseId'
});

const CourseModel = model('Course', courseSchema);
export default CourseModel;
