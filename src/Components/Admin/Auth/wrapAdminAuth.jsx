import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const wrapAdminAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useSelector((store) => store.adminAuth);
    if (!auth.adminJwt) {
      return <Navigate to="/admin/adminLogin" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default wrapAdminAuth;
