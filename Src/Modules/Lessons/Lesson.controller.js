import slugify from "slugify";
import CourseModel from "../../../DB/Models/Course.model.js";
import LessonModel from "../../../DB/Models/Lesson.model.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import enrollmentModel from "../../../DB/Models/Enrollment.model.js";


export const createLesson = async (req, res, next) => {
    const { title, description, instructorId, startTime, order, duration, link } = req.body;
    const { courseId } = req.params;
    const slug = slugify(title, { lower: true });

    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    if (!course.instructors.includes(instructorId)) {
        return next(new AppError("Instructor is not assigned to this course", 400));
    }
    const existingLinkLesson = await LessonModel.findOne({ link });
    if (existingLinkLesson) {
        return next(new AppError("A lesson with this link already exists", 400));
    }
    const existingTitleLesson = await LessonModel.findOne({ courseId, slug, instructorId });
    if (existingTitleLesson) {
        return next(new AppError("Lesson with this title already exists for this instructor", 400));
    }
    const existingorderLesson = await LessonModel.findOne({ courseId, order, instructorId });
    if (existingorderLesson) {
        return next(new AppError("Lesson with this order already exists for this instructor", 400));
    }

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    const conflictingLesson = await LessonModel.findOne({
        instructorId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
    });
    if (conflictingLesson) {
        return next(new AppError("The instructor has a conflicting lesson at this time", 400));
    }
    const newLesson = await LessonModel.create({
        title,
        description,
        courseId,
        instructorId,
        startTime,
        endTime,
        order,
        slug,
        createdBy: req.id,
        duration,
        link
    });
    return next(new AppSuccess("Lesson created successfully", 201, { lesson: newLesson }));
};

export const getLessons = async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const lessons = await LessonModel.find({ courseId }).select('title description averageRating startTime endTime link').populate([
        {
            path: "instructorId",
            select: "userName"
        },
        {
            path: "courseId",
            select: "name"
        }

    ]);
    return next(new AppSuccess("success", 200, { lessons }));
}

export const getLessonsForSpecificInstructor = async (req, res, next) => {
    const { courseId } = req.params;
    const { instructorId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const lessons = await LessonModel.find({ courseId, instructorId }).select('title description averageRating startTime endTime link').populate([
        {
            path: "instructorId",
            select: "userName"
        },
        {
            path: "courseId",
            select: "name"
        }

    ]);
    return next(new AppSuccess("success", 200, { lessons }));
}

export const getLessonDetails = async (req, res, next) => {
    const { courseId, lessonId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const lesson = await LessonModel.findById(lessonId).populate([
        {
            path: "instructorId",
            select: "userName"
        },
        {
            path: "courseId",
            select: "name"
        },
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        },
        {
            path: 'review',
            populate: {
                path: 'studentId',
                select: 'userName',
            }
        }
    ]);
    if (!lesson) {
        return next(new AppError("Lesson not found", 404));
    }
    if (!lesson.courseId.equals(courseId)) {
        return next(new AppError("lesson does not belong to this course", 400));
    }
    return next(new AppSuccess("success", 200, { lesson }));
}

export const updateLesson = async (req, res, next) => {
    const { description, link, status } = req.body;
    const { courseId, lessonId } = req.params;
    const updatedBy = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const existingLinkLesson = await LessonModel.findOne({ link, _id: { $ne: lessonId } });
    if (existingLinkLesson) {
        return next(new AppError("A lesson with this link already exists", 400));
    }
    const lesson = await LessonModel.findByIdAndUpdate(lessonId,
        {
            description,
            link,
            status,
            updatedBy
        },
        {
            new: true,
        }
    ).populate([
        {
            path: "instructorId",
            select: "userName"
        },
        {
            path: "courseId",
            select: "name"
        },
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        }
    ]);
    if (!lesson) {
        return next(new AppError("Lesson not found", 404));
    }
    if (!lesson.courseId.equals(courseId)) {
        return next(new AppError("lesson does not belong to this course", 400));
    }
    return next(new AppSuccess("success", 200, { lesson }));
}

export const deleteLesson = async (req, res, next) => {
    const { courseId, lessonId } = req.params;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const lesson = await LessonModel.findByIdAndDelete(lessonId).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        },
        {
            path: "instructorId",
            select: "userName"
        },
        {
            path: "courseId",
            select: "name"
        },
    ]);
    if (!lesson) {
        return next(new AppError("Lesson not found", 404));
    }
    if (!lesson.courseId.equals(courseId)) {
        return next(new AppError("lesson does not belong to this course", 400));
    }
    return next(new AppSuccess("success", 200, { lesson }));
}

export const updateLessonCompletion = async (req, res, next) => {
    const { courseId, lessonId } = req.params;
    const studentId = req.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const enrollment = await enrollmentModel.findOne({ courseId, studentId });
    if (!enrollment) {
        return next(new AppError("Student is not enrolled in this course", 403));
    }
    const lesson = await LessonModel.findOne({ _id: lessonId, courseId });
    if (!lesson) {
        return next(new AppError("Lesson not found in this course", 404));
    }
    // التحقق مما إذا كان الدرس ينتمي إلى الأستاذ الذي سجل الطالب معه
    const instructorId = enrollment.instructorId; 
    if (lesson.instructorId.toString() !== instructorId.toString()) {
        return next(new AppError("This lesson does not belong to the instructor you are assigned to", 403));
    }
    const completedLesson = enrollment.completedLessons.find(
        (item) => item.lessonId.toString() === lessonId
    );
    if (completedLesson && completedLesson.isCompleted) {
        return next(new AppSuccess("Lesson already marked as completed", 200, { progress: enrollment.progress }));
    }
    if (completedLesson) {
        completedLesson.isCompleted = true;
    } else {
        enrollment.completedLessons.push({ lessonId, isCompleted: true });
    }
    // حساب عدد الدروس الخاصة بالأستاذ
    const totalLessons = await LessonModel.countDocuments({ 
        courseId, 
        instructorId 
    });
    // حساب التقدم
    const completedLessonsCount = enrollment.completedLessons.filter(
        (lesson) => lesson.isCompleted
    ).length;
    enrollment.progress = (completedLessonsCount / totalLessons) * 100;
    await enrollment.save();
    return next(new AppSuccess("Progress updated", 200, { progress: enrollment.progress }));
};

