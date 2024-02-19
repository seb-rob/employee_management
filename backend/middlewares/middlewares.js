const jwt = require("jsonwebtoken")
const Auth = require("../models/auth")
const User = require("../models/user")

// VALIDATE PAGE
exports.passwordResetPageValidation = async (req, res, next) => {
    try {
        const email = req.query.email
        const token = req.query.token
        if (!email || !token) {
            return res.status(400).json({ message: "Bad request. Something went wrong!" })
        }
        const auth = await Auth.findOne({ token })
        if (!auth.isValid) {
            req.user = { email: email, token: token, success: false }
            next()
        } else {
            await jwt.verify(token, process.env.JWT_SECRET)
            req.user = { email: email, token: token, success: true }
            next()
        }
    } catch (err) {
        req.user = { success: false }
        next()
    }
}


// ADMIN OR NOT
exports.isAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.user_id;
        if (!adminId) {
            return res.status(400).json({ message: "Missing user id" })
        }
        const user = await User.findOne({ _id: adminId })
        if (!user) {
            return res.status(400).json({ message: "access denied" })
        }
        if (user.usertype === "admin") {
            next()
        }
    } catch (err) {
        return res.status(401).json({ message: "something went wrong!", error: err })
    }
}