const User = require("../models/user")
const { tokenGenerator } = require("../helper/helpers")

exports.profile = async (req, res) => {
    try {
        const id = req.params.user_id;
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
            department: user.department
        }
        return res.status(200).json({user: userDetails})
    } catch (err) {
        return res.status(500).json({message: "something went wrong", error: err})
    }
}

exports.edit = async (req, res) => {
    try {
        const id = req.params.user_id;
        if (!id) {
            return res.status(400).json({ message: "missing user id" })
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ message: "user not found!" })
        }
        const detailsToBeUpdated = req.body;
        if (detailsToBeUpdated.password || detailsToBeUpdated._id || detailsToBeUpdated.department) {
            return res.status(400).json({ message: "field cannot be updated" })
        }
        if (detailsToBeUpdated.email) {
            const emailExist = await User.findOne({ email: detailsToBeUpdated.email })
            if (emailExist) {
                return res.status(400).json({ message: "email already in use! Try with different email id" })
            }
        }
        await User.findByIdAndUpdate(id, { $set: detailsToBeUpdated })
        const updatedUser = await User.findById(id)
        const objectToBeSend = {
            email: updatedUser.email,
            first_name: updatedUser.fname,
            last_name: updatedUser.lname,
            user_type: updatedUser.usertype,
            department: updatedUser.department
        }
        return res.status(200).json({ message: "profile update successful!", "user": objectToBeSend })
    } catch (err) {
       return res.status(500).json({message: "somethingh went wrong", error: err})
    }
}
