import { Navigate, Outlet } from "react-router-dom";

// PROTECTS USER ROUTES
export default function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.token) {
        return <Navigate to="/login" />
    }
    return <Outlet />;
}