import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQa, logout } from "../../../State/Auth/QA/Action";
import { Link, useNavigate } from "react-router-dom";
import wrapQAAuth from "../Auth/wrapQAAuth";

const NavBar = () => {
  const auth=useSelector(store=>store.qaAuth)
  const jwt=localStorage.getItem('qa_jwt');
  const dispatch=useDispatch()
  const navigate=useNavigate()
  
  useEffect(()=>{
    if(jwt){
        dispatch(getQa(jwt))     
    }
  },[jwt,auth.jwt])

  const handleLogout=()=>{
    dispatch(logout())
    navigate('/qa/login')
  }


  return (
    <nav className="bg-gray-900 text-white py-6 px-10 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/public/adminLogo.png" alt="Crescenda Logo" className="h-10 w-60" /> 
      </div>
      <div className="flex space-x-8">
        <Link to="/qa/dashboard" className="hover:text-yellow-600">Dashboard</Link>
      </div>
      {auth.user?.emailId &&(
      <div className="flex items-center space-x-4">
        <p className="text-white-700">Hi, {auth.user.emailId.split('@')[0].replace(/\d+/g, '')}</p>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
          Logout <span className="text-sm ml-1">↩</span>
        </button>
      </div>
        )}
    </nav>
  );
};

export default wrapQAAuth(NavBar);
