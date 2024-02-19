const mongoose = require("mongoose")


// CREATE SCHEMA
const userModel = mongoose.Schema({
    email: {
        type: String,
        required: [true, "what is your email?"],
        trim: true,
        unique: [true, "email must be unique."],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "create a strong password."],
        minlength: [6, "create strong password with minimum length 6"]
    },
    avatar: {
        type: String,
        default: "",
    },
    fname: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "what is your first name?"],
        match: [/^[a-z]+$/, "first name field can only have alphabets"]
    },
    lname: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "what is your last name?"],
        match: [/^[a-z]+$/, "last name field can only have alphabets"],
    },
    usertype: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: [true, "username is required field"],
        lowercase: true,
        match: [/^[a-zA-Z]+$/, "user type field can have alphabets only."]
    },
    department: {
        type: String,
        lowercase: true,
        required: [true, "which department you belong?"],
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


// CREATE MODEL
const employee = mongoose.model("employee", userModel)
module.exports = employee;