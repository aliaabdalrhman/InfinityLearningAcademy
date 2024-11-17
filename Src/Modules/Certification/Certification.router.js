import { Router } from "express";
import * as certificationController from './Certification.controller.js'
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Certification.role.js";
import { asyncHandler } from "../../Utils/CatchError.js";
import { issueCertificateSchema } from "./Certification.validation.js";
import validation from "../../Middelware/Validation.js";

const router = Router();

router.get('/:courseId/issue',
    asyncHandler(auth(endPoints.create)),
    asyncHandler(validation(issueCertificateSchema)),
    asyncHandler(certificationController.issueCertificate));

export default router;