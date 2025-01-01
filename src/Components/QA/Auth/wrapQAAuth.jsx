import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const wrapQAAuth = (WrappedComponent) => {
  return (props) => {   
    const auth=useSelector(store=>store.qaAuth)
    if (!auth.qaJwt) {
      return <Navigate to="/qa/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default wrapQAAuth;
