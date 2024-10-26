import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.superAdmin, roles.admin],
    get: [roles.superAdmin, roles.admin],
    update: [roles.superAdmin, roles.admin],
    delete: [roles.superAdmin, roles.admin],
};