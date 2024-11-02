import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: Object,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
    }
},
    {
        timestamps: true
    });

const categoryModel = model('Category', categorySchema);
export default categoryModel;