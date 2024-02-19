const express = require("express")
const router = express.Router()
const { login, forgotPassword, resetPassword, resetPasswordPage } = require("../auth/auth")
const { passwordResetPageValidation } = require("../middlewares/middlewares")


// USER AUTHENTICATIONS
router.post("/login", login)
router.post("/forgot-password", forgotPassword)   // email request api
router.get("/password-reset-page", passwordResetPageValidation, resetPasswordPage)  // password reset page api
router.put("/resetpassword", resetPassword)    // password reset api


module.exports = router;