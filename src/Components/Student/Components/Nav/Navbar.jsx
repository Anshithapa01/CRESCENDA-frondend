import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { getUser, logout } from "../../../../State/Auth/User/Action";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const auth = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("user_jwt");
  const location = useLocation();
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, auth.jwtUser]);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate(-1);
    }
  }, [auth.user]);

  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-orange-500 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Cultivate Your Mind, Expand Your Horizons.
        </p>

        <nav aria-label="Top" className="mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* Logo */}
              <div className="ml-4 flex lg:ml-20">
                <a href="http://localhost:5173">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt="CRESCENDA"
                    src="https://res.cloudinary.com/df1rw6pzl/image/upload/v1735300537/n2cqqo7pgl8iys1s2l8w.png"
                    className="h-24 w-auto"
                  />
                </a>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <button
                    onClick={() => navigate("/")}
                    className="font-semibold  text-orange-700 hover:text-orange-800"
                  >
                    Home
                  </button>
                </div>
                {/* Search */}
                <div className="flex lg:ml-6">
                  <button
                    onClick={() => navigate("/search")}
                    className="p-10 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </button>
                </div>
                {auth.user?.firstName ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <Avatar>{auth.user.firstName[0].toUpperCase()}</Avatar>
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <MenuItem>
                        <button
                          onClick={() => navigate("/profile")}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Your Profile
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => navigate("/myCourses")}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          My Courses
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => navigate("/messages")}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Messages
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Sign in
                    </button>
                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-sm font-medium text-gray-700 hover:text-gray-800 p-7"
                    >
                      Create account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
