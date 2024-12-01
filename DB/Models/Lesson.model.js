import { model, Schema, Types } from "mongoose";

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    courseId: {
        type: Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructorId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
    },
    order: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
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
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
    },
    reviews: [
        {
            studentId: {
                type: Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

lessonSchema.virtual('review', {
    ref: 'LessonReview',
    localField: '_id',
    foreignField: 'lessonId'
});

lessonSchema.index({ slug: 1, courseId: 1, instructorId: 1 }, { unique: true });

const LessonModel = model('Lesson', lessonSchema);
export default LessonModel;
