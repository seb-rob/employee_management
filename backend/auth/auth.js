const bcrypt = require("bcryptjs")
const User = require("../models/user");
const { tokenGenerator, sendEmail } = require("../helper/helpers");
const Auth = require("../models/auth")


// USER LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "missing field values"})
        }
        const getUser = await User.findOne({ email })
        if (!getUser) {
            return res.status(401).json({ message: "invalid email or password" })
        }
        if (getUser.isArchived) {
            return res.status(400).json({ message: "user not found" })
        }
        const compare = await bcrypt.compare(password, getUser.password)
        if (!compare) {
            return res.status(401).json({ message: "invalid email or password" })
        }
        const loginToken = tokenGenerator({ id: getUser._id }, "20h")
        return res.status(200).json({
            user: {
                role: getUser.usertype,
                id: getUser._id,
                token: loginToken
        }})
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err })
    }
}


// FORGOT PASSWORD (SEND USER AN eMAIL WITH PASSWORD RESET LINK)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const getUser = await User.findOne({ email })
        if (!getUser) {
            return res.status(401).json({ message: "invalid email"})
        }
        const token = tokenGenerator({ id: getUser._id }, "30m")
        const passwordResetLink = `${req.protocol}://${req.get("host")}/api/auth/password-reset-page?token=${token}&email=${email}`
        const html = `
            <h3> Hello ${getUser.fname}</h3>
            <p>click on the link below to reset password</p>
            <a href="${passwordResetLink}">reset password</a>
        `
        const mail = sendEmail(email, "Password Reset Request", html)
        await Auth.create({ token, email })
        if (mail.success == 0) {
            return res.status(200).json({message: "could not send mail, contact admin"})
        }
        return res.status(200).json({message: "password reset link has been sent to your inbox! or check span!!"})
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err.messsage })
    }
}



// ALLOW USER TO ACCESS PASSWORD RESET PAGE
exports.resetPasswordPage = async (req, res) => {
    try {
        const success = req.user.success   // from middleware passwordResetPageValidation
        if (!success) {
            return res.render("invalidURL")
        }
        return res.render("resetPassword")
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err.message })
    }
}



// ALLOW USER TO CHANGE PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.query.email;
        const token = req.query.token;
        if (!email) {
            return res.status(400).json({ message: 'Bad request' })
        }
        if (!token) {
            return res.status(400).json({message: "Token is missing!"})
        }
        if (!password) {
            return res.status(400).json({ message: "missing field values" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword })
        await Auth.findOneAndUpdate({ token }, { isValid: false })
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        return res.status(200).json({ message: "password update successful!" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "something went wrong", error: err.message })
    }
}
