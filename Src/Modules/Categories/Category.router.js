import { Router } from "express";
import * as categoryController from './Category.controller.js'
import { asyncHandler } from "../../Utils/CatchError.js";
import fileUpload, { fileType } from "../../Utils/Multur.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Category.role.js";
import { createCategorySchema, deleteCategorySchema, getCategoryDetailsSchema, updateCategorySchema } from "./Category.validation.js";
import validation from "../../Middelware/Validation.js";
const router = Router();

router.post('/', fileUpload(fileType.image).single('image'),
    asyncHandler(auth(endPoints.create)),
    validation(createCategorySchema),
    asyncHandler(categoryController.createCategory));

router.get('/', asyncHandler(auth(endPoints.get)),
    asyncHandler(categoryController.getAllCategories));

router.get('/active', asyncHandler(categoryController.getActiveCategories));

router.get('/inActive', asyncHandler(auth(endPoints.get)),
    asyncHandler(categoryController.getInActiveCategories));

router.get('/:id', validation(getCategoryDetailsSchema),
    asyncHandler(categoryController.getCategoryDetails));

router.put('/:id', asyncHandler(auth(endPoints.update)),
    validation(updateCategorySchema),
    asyncHandler(categoryController.updateCategory));

router.delete('/:id', asyncHandler(auth(endPoints.delete)),
    validation(deleteCategorySchema),
    asyncHandler(categoryController.deleteCategory));

export default router;