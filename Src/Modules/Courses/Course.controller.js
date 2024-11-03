import slugify from "slugify";
import CourseModel from "../../../DB/Models/Course.model.js";
import { AppError } from "../../../GlobalError.js";
import cloudinary from "../../Utils/Cloudinary.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import categoryModel from "../../../DB/Models/Category.model.js";
import userModel from "../../../DB/Models/User.model.js";

export const createCourse = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    const { description, categories, level } = req.body;
    let parsedCategories;
    if (categories) {
        parsedCategories = JSON.parse(categories);
    }
    const course = await CourseModel.findOne({ name });
    if (course) {
        return next(new AppError("course already exists", 409));
    }
    const existingCategories = await categoryModel.find({ name: { $in: parsedCategories } });
    const existingCategoryNames = existingCategories.map(category => category.name);
    const invalidCategories = parsedCategories.filter(category => !existingCategoryNames.includes(category));

    if (invalidCategories.length > 0) {
        return next(new AppError(`The following categories are invalid: ${invalidCategories.join(', ')}`, 400));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APPNAME}/course` });
    await CourseModel.create({
        name,
        image: { secure_url, public_id },
        createdBy: req.id,
        slug: slugify(name),
        description,
        categories: parsedCategories,
        level
    });
    return next(new AppSuccess("success", 201));
}

export const assignInstructor = async (req, res, next) => {
    const { courseId } = req.params;
    const { instructorId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const instructor = await userModel.findById(instructorId);
    if (!instructor) {
        return next(new AppError("Instructor not found", 404));
    }
    else if (instructor.role !== 'Instructor') {
        return next(new AppError("user is not an instructor", 404));
    }
    if (course.instructor && course.instructor.toString() === instructorId) {
        return next(new AppError("Instructor is already assigned to this course", 400));
    }
    course.instructor = instructorId;
    await course.save();
    course.image = course.image.secure_url;
    return next(new AppSuccess("success", 200, { course }));
}

export const getAllCourses = async (req, res, next) => {
    let courses = await CourseModel.find().select('name description image level status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

export const getActiveCourses = async (req, res, next) => {
    let courses = await CourseModel.find({ status: 'Active' }).select('name description image level status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

export const getInActiveCourses = async (req, res, next) => {
    let courses = await CourseModel.find({ status: 'InActive' }).select('name description image level status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

