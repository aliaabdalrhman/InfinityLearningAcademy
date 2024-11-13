import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    enroll: [roles.student],
    getEnrolledStudents: [roles.superAdmin, roles.admin],
    getMyStudents: [roles.instructor],
    update: [roles.student],
    delete: [roles.student],
}