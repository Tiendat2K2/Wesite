import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const accessToken = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('roleId'); // Ensure this matches your saved role value ('1' for admin, '2' for teacher)

  // Check if user is authenticated
  if (!accessToken) {
    return <Navigate to="/" />; // Redirect to login if no token is found
  }

  // Check if user role matches the allowed roles
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on the user's role if access is denied
    if (userRole === '1') {
      return <Navigate to="/admin" />; // Redirect admin to admin page if trying to access teacher routes
    } else if (userRole === '2') {
      return <Navigate to="/teacher" />; // Redirect teacher to teacher page if trying to access admin routes
    }
  }

  return <Element />; // Render the protected element if role matches
};

export default ProtectedRoute;
