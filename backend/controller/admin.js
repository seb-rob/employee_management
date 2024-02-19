const User = require("../models/user");
const bcrypt = require("bcryptjs");


// CREATE USER
exports.registerUser = async (req, res) => {
    try {
        const {
            email,
            password,
            fname,
            lname,
            usertype,
            department
        } = req.body;
        if (!email || !password || !fname || !lname || !usertype || !department) {
            return res.status(400).json({ message: "enter required fields." })
        }
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            return res.status(400).json({ message: "email already in use" })
        }
        if (password.length < 6) {
            return res.status(400).json({message: "password length must be greater than 5 characters"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await User.create({
            email,
            password: hashedPassword,
            fname,
            lname,
            usertype,
            department
        })
        return res.status(200).json({ message: "registration successful!" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "something went wrong", error: err })
    }
}

// GET PARTICULAR USER
exports.getUserProfile = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "missing user id" })
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ message: "user not found!" })
        }
        const userDetails = {
            email: user.email,
            id: user._id,
            first_name: user.fname,
            last_name: user.lname,
            user_type: user.usertype,
            department: user.department,
            is_archived: user.isArchived
        }
        return res.status(200).json({"user": userDetails})
    } catch (err) {
        return res.status(500).json({message: "something went wrong", error: err})
    }
}



// UPDATE USER
exports.updateUser = async (req, res) => {
    try {
        const data = req.body;
        const user_id = req.params.id;
        if (data._id) {
            return res.status(400).json({ message: "user id cannot be updated" })
        }
        if (data.email) {
            const getUser = await User.findOne({ email: data.email })
            if (getUser) {
                return res.status(400).json({message: "User with given email already exist! try different email"})
            }
        }
        const user = await User.findById(user_id)
        if (!user) {
            return res.status(200).json({ message: "User does not exist" })
        }
        await User.findByIdAndUpdate(user_id, { $set: data })
        return res.status(200).json({message: "update successful!"})
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err })
    }
}


// GET USERS
exports.employeeList = async (req, res) => {
    try {
        const is_admin = req.params.user_id;
        const users = await User.find({ _id: { $ne: is_admin }, isArchived: {$eq: false} }).select("-password")
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({message: "something went wrong", error: err})
    }
}


// DELETE USER
exports.archiveUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        if (!user_id) {
            return res.status(400).json({ message: "missing user id" })
        }
        const get_user = await User.findById(user_id)
        if (!get_user) {
            return res.status(400).json({ message: "User not found" })
        }
        await User.findByIdAndUpdate(user_id, { $set: { isArchived: true } })
        return res.status(200).json({ message: "User archived!" })
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err })
    }
}


// GET DELETED USERS LIST
exports.archiveUsersList = async (req, res) => {
    try {
        const users = await User.find({ isArchived: {$eq: true} }).select("-password")
        return res.status(200).json({ users })
    } catch (err) {
        return res.status(500).json({message: "something went wrong", error: err})
    }
}


// RESTORE USER
exports.unarchiveUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        const get_user = await User.findById(user_id)
        if (!get_user) {
            return res.status(400).json({ message: "User not found" })
        }
        await User.findByIdAndUpdate(user_id, { $set: { isArchived: false } })
        return res.status(200).json({ message: "User unarchived!" })
    } catch (err) {
        return res.status(500).json({ message: "something went wrong", error: err })
    }
}