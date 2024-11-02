import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.admin, roles.instructor]
}