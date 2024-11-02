import slugify from "slugify";
import CourseModel from "../../../DB/Models/Course.model.js";
import { AppError } from "../../../GlobalError.js";
import cloudinary from "../../Utils/Cloudinary.js";
import { AppSuccess } from "../../../GlobalSuccess.js";
import categoryModel from "../../../DB/Models/Category.model.js";

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
