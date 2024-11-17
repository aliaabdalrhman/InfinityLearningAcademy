import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";


export const issueCertificateSchema = {
    params: joi.object({
        courseId: generalFields.id
    })
};
