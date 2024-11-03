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
    duration: {
        type: Number,
        min: 1
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
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

const CourseModel = model('Course', courseSchema);
export default CourseModel;