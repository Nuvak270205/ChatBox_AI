import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    // const isAuth = !!localStorage.getItem('token');
    const isAuth = true; // Temporary for development purpose

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;