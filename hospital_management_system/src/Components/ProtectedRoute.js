import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRoles }) => {
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('profile')) : null;

    // Log for debugging
    console.log('Token:', token);
    console.log('User:', user);

    // Redirect to login if no token or user data
    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // Redirect to home page if the user does not have any of the required roles
    if (requiredRoles && !requiredRoles.includes(user.user.role)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
