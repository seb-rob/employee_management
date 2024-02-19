const express = require("express")
const router = express.Router()
const { profile, edit } = require("../controller/user")

// NORMAL USERS ROUTE
router.get("/:user_id/profile", profile)
router.put("/:user_id/edit-profile", edit)


module.exports = router;