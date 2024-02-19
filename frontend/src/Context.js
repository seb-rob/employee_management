import React, { createContext, useState } from "react";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [forgotError, setForgotError] = useState(false)
    const [forgotErrorText, setForgotErrorText] = useState("")
    const [success, setSuccess] = useState(false)
    const [successText, setSuccessText] = useState("");
    const [loading, setLoading] = useState(false)

    const contextObj = {
        success,
        setSuccess,
        successText,
        setSuccessText,
        error,
        setError,
        errorText,
        setErrorText,
        forgotError,
        setForgotError,
        forgotErrorText,
        setForgotErrorText,
        loading, 
        setLoading
    }

    // -------------------------- MUST BE WRITTEN IN CHILD ------------------------------

    // REMOVE ERROR ALERT AFTER 5 SECONDS
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setError(false);
    //         setErrorText("");
    //     }, 5000); 
    //     return () => clearTimeout(timer);
    // }, [error]);

    // REMOVE FORGOT ERROR ALERT AFTER 5 SEC
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setForgotError(false);
    //         setForgotErrorText("");
    //     }, 5000); 
    //     return () => clearTimeout(timer);
    // }, [forgotError])

    return (
        <MyContext.Provider value={ contextObj }>
            {children}
        </MyContext.Provider>
    )
};

export default MyProvider;