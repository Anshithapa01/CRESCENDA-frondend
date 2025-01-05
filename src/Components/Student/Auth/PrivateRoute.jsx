import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser, logout } from '../../../State/Auth/User/Action';

const PrivateRoute = () => {
  const auth = useSelector((store) => store.auth);
  const jwt = localStorage.getItem('user_jwt');
  const dispatch = useDispatch();
  const [shouldRun, setShouldRun] = useState(true);

  useEffect(() => {
    if (!shouldRun || !jwt) return;

    dispatch(getUser(jwt));
    const timeout = setTimeout(() => {
      setShouldRun(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [shouldRun, jwt, auth.user, dispatch]);

  const isAuthenticated = Boolean(jwt) && !auth.user?.isBlocked;
  console.log('PrivateRoute isAuthenticated:', isAuthenticated);

  const logoutHandler = () => {
    dispatch(logout());
  };

  // If not authenticated or blocked, log out and navigate to login
  if (!isAuthenticated) {
    logoutHandler();
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const BlockRoute = () => {
  const auth = useSelector((store) => store.auth);
  const jwt = localStorage.getItem('user_jwt');
  const dispatch = useDispatch();
  const [shouldRun, setShouldRun] = useState(true);

  useEffect(() => {
    if (!shouldRun || !jwt) return;

    dispatch(getUser(jwt));
    const timeout = setTimeout(() => {
      setShouldRun(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [shouldRun, jwt, auth.user, dispatch]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  // If user is blocked, log out and navigate to login
  if (auth.user && auth.user.isBlocked) {
    logoutHandler();
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
