const mongoose = require("mongoose")

const authModel = mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    isValid: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const auth = mongoose.model("auth", authModel)
module.exports = auth;