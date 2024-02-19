import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { apis } from '../../helpers';
import { useContext } from 'react';
import { MyContext } from '../../Context';

const LoginComponent = () => {
    const {
        error,
        setError,
        errorText,
        setErrorText,
        forgotError,
        setForgotError,
        forgotErrorText,
        setForgotErrorText,
        success,
        setSuccess,
        successText,
        setSuccessText,
    } = useContext(MyContext)           // CONTEXT FOR ERROR HANDLING

    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);    // MODAL DISPLAY CONTROL
    const [forgotEmail, setForgotEmail] = useState("")

    // LOGIN SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !email.trim() || !password.trim()) {
            setError(true)
            setErrorText("Enter required fields.")
            return;
        }
        const auth = { email: email, password: password }
        try {
            const response = await axios.post(apis.auth.login.url, auth)
            const data = await response.data

            // DATA DOES NOT PERSIST 
            // setContext(prevState => ({
            //     ...prevState,
            //     isAuthenticated: true,
            //     user: data.user
            // }))
            const userObj = {
                token: data.user.token,
                isAuthenticated: true,
                id: data.user.id,
                role: data.user.role
            }
            localStorage.setItem("user", JSON.stringify(userObj))
            navigate("/profile");
            
        } catch (err) {
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
    };

    // FORGOT PASSWORD SUBMIT
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) {
            setForgotError(true)
            setForgotErrorText("Enter you registered email id.")
        }
        try {
            const response = await axios.post(apis.auth.forgotPassword.url, {
                "email" : forgotEmail
            })
            if (response.status === 200) {
                setSuccess(true)
                setSuccessText(response.data.message)
            }
        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setForgotError(true);
                setForgotErrorText(err.message);
                return;
            }
            if (err.response.status === 400 || err.response.status === 401) {
                setForgotError(true)
                setForgotErrorText(err.response.data.message)
                return;
            }
            if (err.response.status === 500) {
                setForgotError(true)
                setForgotErrorText("Server Error!")
                return;
            }
            setForgotError(true)
            setErrorText("Something went wrong!")
            return;
        }
    };


    // IF LOGGED IN REDIRECT USER TO PROFILE PAGE
    useEffect(() => {
        if (localStorage.getItem("user") != null) {
            navigate("/profile")
        }
    });
    

    // REMOVE ALERT AFTER 3 SECONDS
    useEffect(() => {
        const timer = setTimeout(() => {
            // IF ERROR ALERT IS ACTIVE
            if (error) {
                setError(false);
                setErrorText("");
            }
            
            // IF FORGOT ALERT IS ACTIVE
            if (forgotError) {
                setForgotError(false);
                setForgotErrorText("");
            }
            
            // IF SUCCESS ALERT IS ACTIVE
            if (success) {
                setSuccess(false)
                setSuccessText("")
            }
        }, 3000); 
        return () => clearTimeout(timer);
    }, [error, forgotError, success]);

    
    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-5">
                <div className="col-lg-3 col-md-5 col-sm-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Login</h3>
                            <form onSubmit={handleSubmit}>
                                {error && <div className='alert alert-danger'>{errorText}</div>}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control text-lowercase"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
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
                                        required
                                    />
                                </div>
                                <div className='d-grid'>
                                    <button type="submit" className="btn btn-primary mb-3">Login</button>
                                </div>
                                <div>
                                    {/* Use onClick to toggle modal visibility */}
                                    <Link to="#" className='fw-bold' onClick={() => setShowModal(true)}>Forgot Password?</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Forgot Password */}
            {showModal &&
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Forgot Password</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleModalSubmit}>
                                    {forgotError && <div className='alert alert-danger'>{forgotErrorText}</div>}
                                    {success && <div className='alert alert-success'>{successText}</div>}
                                    <div className="mb-3">
                                        <label htmlFor="forgot-email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="forgot-email"
                                            placeholder='Enter your registered email'
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary me-2">Submit</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {showModal &&
                <div className="modal-backdrop fade show"></div>
            }
        </div>
    )
}

export default LoginComponent;
