import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { user, userType } = UserAuth();

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if user is not authenticated
  }

  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" />; // Redirect if user doesn't have required role
  }

  return children; // ✅ This must be returned
};

export default ProtectedRoute;
