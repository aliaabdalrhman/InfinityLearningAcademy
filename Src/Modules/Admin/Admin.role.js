import { roles } from "../../Middelware/Auth.js";

export const endPoints = {
    add:[roles.superAdmin],
    get:[roles.superAdmin],
    delete:[roles.superAdmin],
    update:[roles.superAdmin],
}
