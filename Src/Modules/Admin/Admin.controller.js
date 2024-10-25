import userModel from "../../../DB/Models/User.model.js";
import bcrypt from 'bcryptjs';
import { AppSuccess } from "../../../GlobalSuccess.js";
import { AppError } from "../../../GlobalError.js";

export const addAdmin = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const admin = await userModel.findOne({ email, role: 'Admin' });
    if (admin) {
        return next(new AppError("Email already exists", 409));
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    await userModel.create({ userName, email, password: hashedPassword,role:'Admin' });
    return next(new AppSuccess("success", 201));
}

export const getAllAdmins = async (req, res, next) => {
    const admins = await userModel.find({ role: 'Admin' }).select('-password');
    return next(new AppSuccess('success', 200, { admins }));
}

export const getActiveAdmins = async (req, res, next) => {
    const admins = await userModel.find({ role: 'Admin', status: 'Active' }).select('-password');
    return next(new AppSuccess('success', 200, { admins }));
}

export const getInActiveAdmins = async (req, res, next) => {
    const admins = await userModel.find({ role: 'Admin', status: 'InActive' }).select('-password');
    return next(new AppSuccess('success', 200, { admins }));
}

export const deleteAdmin = async (req, res, next) => {
    const { id } = req.params;
    const admin = await userModel.findByIdAndDelete(id);
    if (!admin) {
        return next(new AppError("admin doesn't exists", 404));
    }
    return next(new AppSuccess('success', 200));
}

export const updateAdmin = async (req, res, next) => {
    const { id } = req.params;
    const { email, status } = req.body;
    const admin = await userModel.findByIdAndUpdate(id, { email, status }, { new: true });
    if (!admin) {
        return next(new AppError("admin doesn't exists", 404));
    }
    return next(new AppSuccess('success', 200, { admin }));
}

