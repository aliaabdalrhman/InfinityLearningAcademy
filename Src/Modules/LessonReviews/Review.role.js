import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    create: [roles.student],
    delete: [roles.student]
}