import slugify from "slugify";
import categoryModel from "../../../DB/Models/Category.model.js";
import cloudinary from "../../Utils/Cloudinary.js";
import { AppError } from "../../../GlobalError.js";
import { AppSuccess } from "../../../GlobalSuccess.js";


export const createCategory = async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase();
    const category = await categoryModel.findOne({ name: req.body.name });
    if (category) {
        return next(new AppError("category already exists", 409));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APPNAME}/category` });
    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;
    req.body.slug = slugify(req.body.name);
    await categoryModel.create(req.body);
    return next(new AppSuccess("success", 201));
}

export const getAllCategories = async (rea, res, next) => {
    let categories = await categoryModel.find({}).select('name image');
    categories = categories.map(category => {
        return {
            ...category.toObject(),
            image: category.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { categories }));
}

export const getActiveCategories = async (req, res, next) => {
    let categories = await categoryModel.find({ status: 'Active' }).select('name image');
    categories = categories.map(category => {
        return {
            ...category.toObject(),
            image: category.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { categories }));
}

export const getInActiveCategories = async (req, res, next) => {
    let categories = await categoryModel.find({ status: 'InActive' }).select('name image');
    categories = categories.map(category => {
        return {
            ...category.toObject(),
            image: category.image.secure_url
        }
    })
    return next(new AppSuccess("success", 200, { categories }));
}

export const getCategoryDetails = async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        }
    ]);
    if (!category) {
        return next(new AppError('Invalid category', 404));
    }
    category.image = category.image.secure_url;
    return next(new AppSuccess("success", 200, { category }));
}

export const updateCategory = async (req, res, next) => {
    const { name, status } = req.body;
    const updatedBy = req.id;
    const { id } = req.params;
    let category = await categoryModel.findByIdAndUpdate(id, { name, status, updatedBy, slug: slugify(name) }, { new: true }).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        }
    ]);
    if (!category) {
        return next(new AppError('Invalid category', 404));
    }
    category.image = category.image.secure_url;
    return next(new AppSuccess("success", 200, { category }));

}

export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    let category = await categoryModel.findByIdAndDelete(id).populate([
        {
            path: 'createdBy',
            select: 'userName'
        },
        {
            path: 'updatedBy',
            select: 'userName'
        }
    ]);
    if (!category) {
        return next(new AppError('Invalid category', 404));
    }
    await cloudinary.uploader.destroy(category.image.public_id);
    return next(new AppSuccess("success", 200, { category }));

}
