import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser, logout } from "../../../../State/Auth/Mentor/Action";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useSelector((store) => store.mentorAuth);
    const jwt = localStorage.getItem('jwt');
    const dispatch = useDispatch();
    const [shouldRun, setShouldRun] = useState(true);

    useEffect(() => {
      if (!shouldRun || !jwt) return;

      dispatch(getUser(jwt));
      const timeout = setTimeout(() => {
        setShouldRun(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }, [shouldRun, jwt,auth.user, dispatch]);
    console.log(auth);
    
    if (!auth.jwt) {
      return <Navigate to="/mentor/login" />;
    }else if(auth.user?.isBlocked){
      dispatch(logout());
      return <Navigate to="/mentor/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

