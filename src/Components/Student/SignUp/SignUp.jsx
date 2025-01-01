import React, { useEffect, useState } from "react";
import Button from "../../OtherComponents/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, register } from "../../../State/Auth/User/Action";
import Alert from "../../OtherComponents/Alert";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector((store) => store.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const [formErrors, setFormErrors] = useState({});

  // Form validation logic
  const validateForm = (studentData) => {
    const errors = {};
    if (!studentData.firstName) errors.firstName = "First Name is required.";
    if (!studentData.lastName) errors.lastName = "Last Name is required.";
    if (!studentData.emailId) errors.emailId = "Email is required.";
    if (!studentData.phoneNumber)
      errors.phoneNumber = "Phone Number is required.";
    if (!studentData.password) errors.password = "Password is required.";
    if (!studentData.confirmPassword)
      errors.confirmPassword = "Confirm Password is required.";
    if (studentData.password !== studentData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const studentData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      emailId: data.get("email"),
      phoneNumber: data.get("phoneNumber"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };

    const errors = validateForm(studentData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    try {
      await dispatch(register(studentData));
      navigate("/");
      setAlert({ message: "Signup successful", status: "success" });
      setShowAlert(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.error("Signup error:", errorMessage);
      setAlert({ message: errorMessage, status: "error" });
      setShowAlert(true);
    }
  };

  return (
    <div className="flex h-screen">
        
      <div
        className="w-1/2 hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: "url('student-signup.jpeg')" }}
      ></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center from-orange-200 to-orange-300">
   
          {showAlert && (
            <Alert
              message={alert.message}
              status={alert.status}
              onClose={() => {
                setShowAlert(false);
                setAlert({ message: "", status: "" });
              }}
            />
          )}
       
        <div className="w-3/4 lg:w-2/3">
          <img src="logo-2.png" alt="Logo" className="h-10 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-center">
            Create Your Account
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.emailId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {formErrors.emailId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.emailId}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <Button text={"Sign Up"} width={"w-full"} />
            <button
              type="button"
              className="w-full py-2 px-4 border flex items-center justify-center rounded-lg mt-2"
            >
              <img src="google.jpeg" alt="Google logo" className="h-5 mr-2" />
              Sign up with Google
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an Account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
