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

export const assignInstructors = async (req, res, next) => {
    const { courseId } = req.params;
    const { instructorIds } = req.body; // تعديل لتستقبل مصفوفة من معرّفات الأساتذة
    const course = await CourseModel.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    for (let instructorId of instructorIds) {
        const instructor = await userModel.findById(instructorId);
        if (!instructor) {
            return next(new AppError(`Instructor with id ${instructorId} not found`, 404));
        }
        if (instructor.role !== 'Instructor') {
            return next(new AppError(`User with id ${instructorId} is not an instructor`, 404));
        }
        if (course.instructors && course.instructors.includes(instructorId)) {
            return next(new AppError(`Instructor with id ${instructorId} is already assigned to this course`, 400));
        }
    }
    course.instructors = [...new Set([...course.instructors, ...instructorIds])];
    await course.save();
    course.image = course.image.secure_url;
    return next(new AppSuccess("Instructors assigned successfully", 200, { course }));
}

export const getAllCourses = async (req, res, next) => {
    let courses = await CourseModel.find().select('name description image level averageRating status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

export const getActiveCourses = async (req, res, next) => {
    let courses = await CourseModel.find({ status: 'Active' }).select('name description image averageRating level status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

export const getInActiveCourses = async (req, res, next) => {
    let courses = await CourseModel.find({ status: 'InActive' }).select('name description image averageRating level status');
    courses = courses.map(course => {
        return {
            ...course.toObject(),
            image: course.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { courses }));
}

export const getCourseDetails = async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findById(id).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'instructors',
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
    if (!course) {
        return next(new AppError('course not found', 404));
    }
    course.image = course.image.secure_url;
    return next(new AppSuccess("success", 200, { course }));
}

export const updateCourse = async (req, res, next) => {
    const { name, status, description } = req.body;
    const updatedBy = req.id;
    const { id } = req.params;
    let course = await CourseModel.findByIdAndUpdate(id, {
        name,
        status,
        description,
        updatedBy,
        slug: slugify(name)
    },
        { new: true }).populate([
            {
                path: 'createdBy',
                select: 'userName'
            },
            {
                path: 'updatedBy',
                select: 'userName'
            }
        ]);
    if (!course) {
        return next(new AppError('course not found', 404));
    }
    course.image = course.image.secure_url;
    return next(new AppSuccess("success", 200, { course }));
}

export const deleteCourse = async (req, res, next) => {
    const { id } = req.params;
    let course = await CourseModel.findByIdAndDelete(id).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        }
    ]);
    if (!course) {
        return next(new AppError('course not found', 404));
    }
    await cloudinary.uploader.destroy(course.image.public_id);
    return next(new AppSuccess("success", 200, { course }));

}