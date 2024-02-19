import { Navigate, Outlet } from "react-router-dom";

// PROTECTS ADMIN ROUTES
export default function ProtectedRoute({ children }) {
    const { role } = JSON.parse(localStorage.getItem("user"));
    if (!role) {
        return <Navigate to="/login" />
    }
    if (role == "user") {
        return <Navigate to="/profile" />
    }
    return <Outlet />;
}