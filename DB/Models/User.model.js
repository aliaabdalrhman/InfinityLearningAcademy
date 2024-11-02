import { model, Schema } from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    phone: {
        type: Number,
    },
    address: {
        type: String
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
    }
    ,
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'

    },
    sendCode: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    });

const userModel = model('User', userSchema);

export default userModel;