import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useSelector((store) => store.mentorAuth);
    if (!auth.jwt) {
      return <Navigate to="/mentor/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
