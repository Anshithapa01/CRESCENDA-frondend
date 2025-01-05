import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getQa, logout } from "../../../State/Auth/QA/Action";

const wrapQAAuth = (WrappedComponent) => {
  return (props) => {
    const auth=useSelector(store=>store.qaAuth)
    const jwt = localStorage.getItem('qa_jwt');
    const dispatch = useDispatch();
    const [shouldRun, setShouldRun] = useState(true);

    useEffect(() => {
      if (!shouldRun || !jwt) return;

      dispatch(getQa(jwt));
      const timeout = setTimeout(() => {
        setShouldRun(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }, [shouldRun, jwt,auth.user, dispatch]);
    console.log(auth);

    if (!auth.qaJwt) {
      return <Navigate to="/qa/login" />;
    }else if(auth.user?.isBlocked){
      dispatch(logout());
      return <Navigate to="/qa/login" />;
    }
    return <WrappedComponent {...props} />;
  };
}
export default wrapQAAuth;
