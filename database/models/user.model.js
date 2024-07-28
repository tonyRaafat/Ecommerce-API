import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength:3,
        maxlength:15,
        trim:true
    },

    email: {
        type: String,
        required: [true, "email is required"],
        lowercase:true,
        unique: [true, "email must be unique"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "age is required"],
    },

    address: [String],
    phone: { type: String, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['User', 'Admin']
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    otp: {
        code: String,
        createdDate: Date,
        expiaryDate: Date
    },
    passwordChanged:Date
},{
    timestamps:true,
    versionKey:false
});

export const User = model('User', userSchema);
