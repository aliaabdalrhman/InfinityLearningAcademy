import { Schema, model, Types } from "mongoose";

const certificationSchema = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: "User", // يشير إلى المستخدم الطالب
        required: true,
    },
    courseId: {
        type: Types.ObjectId,
        ref: "Course", // يشير إلى الكورس
        required: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now, // تاريخ إصدار الشهادة
    },
    filePath: {
        type: String,
        required: true, // مسار حفظ ملف الشهادة
    },
    status: {
        type: String,
        enum: ["Pending", "Issued"],
        default: "Issued", // الحالة الافتراضية: تم الإصدار
    },
}, {
    timestamps: true
});

const CertificationModel = model("Certification", certificationSchema);

export default CertificationModel;
