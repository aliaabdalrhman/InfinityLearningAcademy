import { model, Schema, Types } from "mongoose";

const enrollmentSchema = new Schema(
    {
        studentId: {
            type: Types.ObjectId,
            ref: 'User',
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
        enrollmentDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        completionDate: {
            type: Date
        },
        completedLessons: [
            {
                lessonId: {
                    type: Types.ObjectId,
                    ref: 'Lesson',
                    required: true
                },
                isCompleted: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        status: {
            type: String,
            enum: ['Enrolled', 'Completed', 'Withdrawn', 'Pending'],
            default: 'Enrolled',
            required: true
        }
    },
    {
        timestamps: true
    }
);
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const enrollmentModel = model('Enrollment', enrollmentSchema);

export default enrollmentModel;
