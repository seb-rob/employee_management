import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../Context";
import { apis } from "../../helpers";
import axios from "axios";

const ArchiveList = () => {
    const {
        loading,
        setLoading,
        error,
        setError,
        errorText,
        setErrorText,
        success,
        setSuccess,
        setSuccessText,
        successText
    } = useContext(MyContext)       // FROM CONTEXT
    const [archives, setArchives] = useState([])     // INTIAL FETCH
    const [archivesTrigger, setArchivesTrigger] = useState(false)

    
    // FETCH USERS FROM SERVER
    const fetchData = async () => {
        try {
            const {id} = JSON.parse(localStorage.getItem("user"))
            const url = apis.admin.archiveUsersList.url.replace(":user_id", id)
            const response = await axios.get(url)
            const data = await response.data
            setArchives(data.users)
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
        setArchivesTrigger(false)
    }, [archivesTrigger])


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

    
    // UN ARCHIVE USER
    const handleUnArchive = async (rid) => {
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
            const url = apis.admin.unarchiveUser.url.replace(":user_id", id).replace(":id", rid);
            const response = await axios.put(url)
            if (response.status === 200) {
                setSuccess(true)
                setSuccessText(response.data.message)
                const timer = setTimeout(() => {
                    setArchivesTrigger(true)
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


    return (
        <div className="container-fluid mt-5">
            {error && <div className="alert alert-danger">{errorText}</div> }
            {success && <div className="alert alert-success">{successText}</div> }
            {
                loading ? <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> :
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>User Details</h2>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>User Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archives.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td className="text-capitalize"><Link to={`/profile/${user._id}`}>{user.fname}</Link></td>
                                        <td className="text-capitalize">{user.lname}</td>
                                        <td>{user.email}</td>
                                        <td className="text-capitalize">{user.department}</td>
                                        <td className="text-capitalize">{user.userType}</td>
                                        <td>
                                            <div className="d-none d-lg-inline">
                                                <button className="btn btn-primary me-2" onClick={() => handleUnArchive(user._id)}>Unarchive</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    );
};

export default ArchiveList;
