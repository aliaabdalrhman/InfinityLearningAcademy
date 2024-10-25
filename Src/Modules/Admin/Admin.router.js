import { Router } from "express";
import * as adminController from './Admin.controller.js'
import { auth } from "../../Middelware/Auth.js";
import { asyncHandler } from "../../Utils/CatchError.js";
import { endPoints } from "./Admin.role.js";
import validation from "../../Middelware/Validation.js";
import { addAdminSchema, deleteAdminSchema, updateAdminSchema } from "./Admin.validation.js";
const router = Router();

router.post('/', asyncHandler(auth(endPoints.add)),
    asyncHandler(validation(addAdminSchema)),
    asyncHandler(adminController.addAdmin));

router.get('/', auth(endPoints.get),
    asyncHandler(adminController.getAllAdmins));

router.get('/active', auth(endPoints.get),
    asyncHandler(adminController.getActiveAdmins));

router.get('/Inactive', auth(endPoints.get),
    asyncHandler(adminController.getInActiveAdmins));

router.put('/:id', auth(endPoints.update),
    asyncHandler(validation(updateAdminSchema)),
    asyncHandler(adminController.updateAdmin));

router.delete('/:id', auth(endPoints.delete),
    asyncHandler(validation(deleteAdminSchema)),
    asyncHandler(adminController.deleteAdmin));

export default router;