import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  
  const auth=useSelector(store=>store.auth)
  const isAuthenticated = Boolean(localStorage.getItem('user_jwt'));

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
