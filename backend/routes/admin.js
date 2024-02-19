const express = require("express")
const router = express.Router()
const {
    registerUser,
    updateUser,
    employeeList,
    archiveUser,
    archiveUsersList,
    unarchiveUser,
    getUserProfile
} = require("../controller/admin")
const { isAdmin } = require("../middlewares/middlewares")


// CRUD USER
router.post("/:user_id/register", isAdmin, registerUser)
router.get("/:user_id/profile/:id", isAdmin, getUserProfile)
router.put("/:user_id/edit/:id", isAdmin, updateUser)
router.get("/:user_id/get-employees", isAdmin, employeeList)
router.put("/:user_id/archive-user/:id", isAdmin, archiveUser)


// ARCHIVED USERS ACTIONS
router.get("/:user_id/archive-list", isAdmin, archiveUsersList)
router.put("/:user_id/unarchive-user/:id", isAdmin, unarchiveUser)


module.exports = router;