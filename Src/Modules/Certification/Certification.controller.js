import { AppError } from "../../../GlobalError.js";
import enrollmentModel from "../../../DB/Models/Enrollment.model.js";
import CourseModel from "../../../DB/Models/Course.model.js";
import generateCertificate from "../../Utils/Pdf.js";

export const issueCertificate = async (req, res, next) => {
    const { courseId } = req.params;
    const studentId = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const enrollment = await enrollmentModel.findOne({ courseId, studentId });
    if (!enrollment) {
        return next(new AppError("Student is not enrolled in this course", 403));
    }
    if (enrollment.progress < 100) {
        return next(new AppError("Course not completed yet", 400));
    }

    const data = {
        studentName: req.userName,
        courseTitle: course.name,
        completionDate: new Date(),
        courseDuration: course.duration,
    };
    generateCertificate(data, "data.pdf");
    res.status(200).json({ message: "Certificate generated successfully" });
};
