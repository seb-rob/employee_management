import React, { useContext, useEffect, useState } from "react";
import { apis } from "../../helpers";
import axios from "axios";
import { MyContext } from "../../Context";
import {useNavigate} from "react-router-dom"


const UserProfileComponent = () => {
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
    const [profile, setProfile] = useState({})  // INTIAL FETCH
    const [edit, setEdit] = useState(false)
    const[firstName, setFirstName] = useState("")
    const[lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    

    // FETCH USERS DETAILS
    const fetchData = async () => {
        try {
            const {id} = JSON.parse(localStorage.getItem("user"))
            const url = apis.user.profile.url.replace(":user_id", id)
            const response = await axios.get(url)
            const data = await response.data
            setProfile(data.user)
        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setError(true);
                setErrorText(err.message);
                return;
            }
            if (err.response.status === 400 || err.response.status === 401) {
                setError(true)
                setErrorText("Could fetch details")
            }
            if (err.response.status === 500) {
                setError(true)
                setErrorText("Server Error!")
            }
            setError(true)
            setErrorText("Something went wrong!")
        }
    }

    // HANDLE LOG OUT
    const hanldeLogout = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    // EDIT -> TRUE or FALSE
    const handleEdit = () => {
        setEdit(!edit)
    }

    // EDIT DETAILS
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError(true)
            setErrorText("Fields cannot be empty!!")
        }
        try {

            // CHECK WHICH FIELD HAS BEEN CHANGED
            let userObj = {};
            if (profile.email !== email) {
                userObj = {...userObj, "email": email}
            }
            if (profile.first_name !== firstName) {
                userObj = {...userObj, "fname": firstName}
            }
            if (profile.last_name !== lastName) {
                userObj = {...userObj, "lname": lastName}
            }
            if (Object.keys(userObj).length === 0) {
                setError(true)
                setErrorText("Details has not been edited!")
                return;
            }
            // EDIT REQUEST
            const { id } = JSON.parse(localStorage.getItem("user"))
            const url = apis.user.editProfile.url.replace(":user_id", id);
            const response = await axios.put(url, userObj)
            // IF SUCCESS
            if (response.status === 200) {
                setSuccess(true)
                setSuccessText(response.data.message)
                setProfile(response.data.user)
                // TRIGGER EDIT STATE
                const timer = setTimeout(() => {
                    setEdit(!edit)
                }, 2000)
                return () => clearTimeout(timer)
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
                setError(true);
                setErrorText("Server Error!!");
                return;
            }
            setError(true)
            setErrorText("something went wrong")
            return;
        }
    }


    // ON RENDER FETCH USER DETAILS
    useEffect(() => {
        setLoading(true)
        fetchData();
        setLoading(false)
    }, []);


    // AFTER USER DETAILS ARE FETCHED SET STATES
    // FOR EDITS
    useEffect(() => {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setEmail(profile.email);
    }, [profile]);


    // REMOVE ERROR ALERT AFTER 5 SECONDS
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
        <div className="container mt-5">
            {
                loading ? <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> :
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <div className="card">
                            <div className="card-header d-flex justify-content-around align-items-center">
                                <h4 className="card-title">Editable Details</h4>
                                <span className="text-primary" onClick={handleEdit}>Edit Details</span>
                                <button className="btn btn-danger" onClick={hanldeLogout}>Logout</button>
                            </div>
                            <div className="card-body">

                                
                                {/* CONDITIONAL RENDERING */}
                                {
                                    !edit ? <div>
                                        <strong>First Name</strong>
                                        <p className="text-capitalize"> {profile.first_name}</p>

                                        <strong>Last Name</strong>
                                        <p className="text-capitalize"> {profile.last_name } </p>

                                        <strong>Email</strong>
                                        <p className="text-lowercase"> {profile.email }</p>
                                    </div> :
                                        <form onSubmit={handleEditSubmit}>
                                            {
                                                error && edit && !success ? <div className="alert alert-danger">{errorText}</div> :null
                                            }
                                            {
                                                success && edit && !error ? <div className="alert alert-success">{successText}</div> : null  
                                            }
                                            <div className="mb-3 rounded">
                                              <label>First Name: </label>      
                                            <input
                                                type="text"
                                                className="text-capitalize fw-bold mx-2"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                />
                                        </div>
                                        <div className="mb-3">
                                            <label>Last Name: </label>  
                                            <input
                                                type="text"
                                                className="text-capitalize fw-bold mx-2"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Email: </label>  
                                            <input
                                                type="email"
                                                className="fw-bold mx-2"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Update</button>
                                    </form>
                                }


                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mt-3 mt-md-0">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3 className="card-title">Non-Editable Details</h3>
                            </div>
                            <div className="card-body">
                                <strong>Department</strong>
                                <p> {profile.department}</p>

                                <strong>Role</strong>
                                <p>{profile.user_type}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserProfileComponent;
