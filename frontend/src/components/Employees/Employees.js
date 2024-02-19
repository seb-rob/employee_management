import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../Context";
import axios from "axios";
import { apis } from "../../helpers";

const UserDetailsPage = () => {
    const {
        loading,
        setLoading,
        error,
        setError,
        errorText,
        setErrorText,
        success,
        setSuccess,
        successText,
        setSuccessText,
    } = useContext(MyContext)       // FROM CONTEXT
    const [employees, setEmployees] = useState([])     // INTIAL FETCH
    const [employeesTriggerer, setEmployeesTrigger] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false);
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState("")
    const [department, setDepartment] = useState("")


    // FETCH USERS FROM SERVER
    const fetchData = async () => {
        try {
            const {id} = JSON.parse(localStorage.getItem("user"))
            const url = apis.admin.employeeList.url.replace(":user_id", id)
            const response = await axios.get(url)
            const data = await response.data
            setEmployees(data.users)
        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setError(true);
                setErrorText(err.message);
                return;
            }
            if (err.response.status === 400 || err.response.status === 401) {
                setError(true)
                setErrorText(err.response.data.message)
                return;
            }
            if (err.response.status === 500) {
                setError(true)
                setErrorText("Server Error!")
                return;
            }
            setError(true)
            setErrorText("Something went wrong!")
            return;
        }
    }


    // MODAL SUBMIT TO ADD USER
    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password || !firstName.trim() || !lastName.trim() || !department.trim() || !userType.trim()) {
            setError(true)
            setErrorText("All fields are required.")
        }
        try {
            const { id } = JSON.parse(localStorage.getItem("user"))
            const url = apis.admin.registerUser.url.replace(":user_id", id)
            const userObj = { fname: firstName, lname: lastName, email, password, department, usertype: userType }
            const response = await axios.post(url, userObj)
            if (response.status === 200) {
                setSuccess(true);
                setSuccessText(response.data.message);
                const timer = setTimeout(() => {
                    setEmail("")
                    setPassword("")
                    setFirstName("")
                    setLastName("")
                    setDepartment("")
                    setUserType("")
                    setShowAddModal(false)
                    setEmployeesTrigger(true)
                }, 2000)
                return () => clearTimeout(timer);
            }
        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setError(true);
                setErrorText(err.message);
                return;
            }
            if (err.response.status === 400 || err.response.status === 401) {
                setError(true)
                setErrorText(err.response.data.message)
                return;
            }
            if (err.response.status === 500) {
                setError(true)
                setErrorText("Server Error!")
                return;
            }
            setError(true)
            setErrorText("Something went wrong!")
            return;
        }
    };


    // ARCHIVE USER
    const handleArchiveUser = async (rid) => {
        if (!rid) {
            setError(true)
            setErrorText("ID missing, something went wrong!");
            return;
        }
        try {
            const { id } = JSON.parse(localStorage.getItem("user"));
            if (!id) {
                setError(true)
                setErrorText("user id is missing, something went wrong!")
            }
            const url = apis.admin.archiveUser.url.replace(":user_id", id).replace(":id", rid);
            const response = await axios.put(url)
            if (response.status === 200) {
                setSuccess(true)
                setSuccessText(response.data.message)
                const timer = setTimeout(() => {
                    setEmployeesTrigger(true)
                }, 2000)
                return () => clearTimeout(timer);
            }
        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setError(true);
                setErrorText(err.message);
                return;
            }
            if (err.response.status === 400 || err.response.status === 401) {
                setError(true)
                setErrorText(err.response.data.message)
                return;
            }
            if (err.response.status === 500) {
                setError(true)
                setErrorText("Server Error!")
                return;
            }
            setError(true)
            setErrorText("Something went wrong!")
            return;
        }
    }

    // ON RENDER FETCH USER
    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        setEmployeesTrigger(false);
    }, [employeesTriggerer])
    

    // REMOVE ALERT AFTER 5 SECONDS
    useEffect(() => {
        const timer = setTimeout(() => {
            // IF ERROR ALERT IS ACTIVE
            setError(false);
            setErrorText("");
            // IF SUCCESS ALERT IS ACTIVE
            setSuccess(false)
            setSuccessText("")
        }, 3000);
        return () => clearTimeout(timer);
    }, [error, success]);

    
    return (
        <div className="container-fluid mt-5">
            {error && !showAddModal && <div className="alert alert-danger">{errorText}</div>  }
            {success && !showAddModal && <div className="alert alert-success">{successText}</div>  }
            {
                loading ? <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> :
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>User Details</h2>
                            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>Add User</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>User Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            {/* BELOW ROUTE NOT IMPLEMENTED */}
                                            <td className="text-capitalize"><Link to={`/profile/${user._id}`}>{user.fname}</Link></td>
                                            <td className="text-capitalize">{user.lname}</td>
                                            <td>{user.email}</td>
                                            <td className="text-capitalize">{user.department}</td>
                                            <td className="text-capitalize">{user.userType}</td>
                                            <td>
                                                <div className="dropdown d-lg-none">
                                                    <button className="btn btn-primary dropdown-toggle" type="button" id={`dropdownMenuButton-${user.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                                        More
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${user.id}`}>
                                                        <li><Link className="dropdown-item" to={`/profile/${user._id}`}>Edit</Link></li>
                                                        <li><button className="dropdown-item" onClick={() => handleArchiveUser(user._id)}>Archive</button></li>
                                                    </ul>
                                                </div>
                                                <div className="d-none d-lg-inline">
                                                    <Link className="btn btn-primary me-2" to={`/profile/${user._id}`}>Edit</Link>
                                                    <button className="btn btn-danger"  onClick={() => handleArchiveUser(user._id)}>Archive</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add User Modal */}
                        <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="addUserModalLabel" aria-hidden={!showAddModal}>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addUserModalLabel">Add User</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Add User Form */}
                                        <form onSubmit={handleAddUser}>
                                            { success && showAddModal && <div className="alert alert-success">{successText}</div> }
                                            { error && showAddModal && <div className="alert alert-danger">{errorText}</div> }
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input 
                                                    type="email"
                                                    className="form-control text-lowercase"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control text-lowercase" 
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control text-lowercase" 
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="userType" className="form-label">User Type</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control text-lowercase" 
                                                    id="userType"
                                                    value={userType}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="department" className="form-label">Department</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control text-lowercase" 
                                                    id="department"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            }
        </div>
    );
};

export default UserDetailsPage;
