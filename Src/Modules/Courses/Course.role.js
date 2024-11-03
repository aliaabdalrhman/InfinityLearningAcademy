import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.superAdmin, roles.admin],
    assignInstructor: [roles.superAdmin, roles.admin],
    get: [roles.superAdmin, roles.admin],

}