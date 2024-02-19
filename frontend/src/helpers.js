exports.apis = {
    user: {
        profile: {
            url: `${process.env.REACT_APP_BACKEND}/api/user/:user_id/profile`
        },
        editProfile: {
            url: `${process.env.REACT_APP_BACKEND}/api/user/:user_id/edit-profile`
        },
    },
    admin: {
        registerUser: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/register`
        },
        getUserProfile: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/profile/:id`
        },
        updateUser: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/edit/:id`
        },
        employeeList: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/get-employees`
        },
        archiveUser: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/archive-user/:id`
        },
        archiveUsersList: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/archive-list`
        },
        unarchiveUser: {
            url: `${process.env.REACT_APP_BACKEND}/api/admin/:user_id/unarchive-user/:id`
        }
    },
    auth: {
        login: {
            url: `${process.env.REACT_APP_BACKEND}/api/auth/login`
        },
        forgotPassword: {
            url: `${process.env.REACT_APP_BACKEND}/api/auth/forgot-password`
        }
    }
}

exports.sidebarItems = [
    {
        id: 0,
        role: ["user", "admin"],
        text: "Profile",
        to: "/profile",
    },
    {
        id: 1,
        role: ["admin"],
        text: "Employees",
        to: "/employees",
    },
    {
        id: 2,
        role: ["admin"],
        text: "Archive",
        to: "/archives",
    }
]