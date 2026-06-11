import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("yumpos_token");
  return <>{isAuthenticated ? children : <Navigate to="/" />}</>;
}

export default PrivateRoute;
