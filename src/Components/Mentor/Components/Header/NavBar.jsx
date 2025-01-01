import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../../State/Auth/Mentor/Action";
import withAuth from "../Auth/withAuth";
import Avatar from "../../../Student/Components/Nav/Avatar";

const NavBar = () => {
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector((store) => store.mentorAuth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, auth.jwt]);

  useEffect(() => {
  }, [auth.user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/mentor/login");
  };

  return (
    <nav className="bg-white shadow-md ml-5 py-4 px-6 flex justify-between items-center">
      <img src="../../../public/logo-2.png" className="h-14 " />
      <div className="flex space-x-8">
        <Link
          to={"/mentor/dashboard"}
          className={`text-gray-700 hover:text-yellow-600 ${
            activeLink.startsWith("/mentor/dashboard")
              ? "font-bold text-yellow-600"
              : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to={"/mentor/courses"}
          className={`text-gray-700 hover:text-yellow-600 ${
            activeLink.startsWith("/mentor/courses")
              ? "font-bold text-yellow-600"
              : ""
          }`}
        >
          My Courses
        </Link>
        <Link
          to={"/mentor/messages"}
          className={`text-gray-700 hover:text-yellow-600 ${
            activeLink.startsWith("/mentor/messages")
              ? "font-bold text-yellow-600"
              : ""
          }`}
        >
          Messages
        </Link>
        <Link
          to={"/mentor/aboutUs"}
          className={`text-gray-700 hover:text-yellow-600 ${
            activeLink.startsWith("/mentor/about")
              ? "font-bold text-yellow-600"
              : ""
          }`}
        >
          About Us
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {auth.user?.emailId && (
          <>
            <p className="text-gray-700">
              Hi, {auth.user.emailId.split("@")[0].replace(/\d+/g, "")}
            </p>
            {auth.user.image ? (
              <div className="relative bg-amber-700 rounded-full w-12 h-12 flex items-center justify-center">
                <img
                  onClick={() => navigate("/mentor/profile")}
                  src={auth.user.image || "https://via.placeholder.com/150"}
                  alt={`${auth.user.firstName} ${auth.user.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
              </div>
            ) : (
              <button onClick={() => navigate("/mentor/profile")}>
                <Avatar>{auth.user.firstName[0].toUpperCase()}</Avatar>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default withAuth(NavBar);
