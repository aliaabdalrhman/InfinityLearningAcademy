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
        uniqe: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    attendees: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});


const LessonModel = model('Lesson', lessonSchema);
export default LessonModel;
