import React, { useEffect, useState } from "react";
import Form from "../../OtherComponents/Form";
import Layout from "../../OtherComponents/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../State/Auth/Mentor/Action";
import Alert from "../../OtherComponents/Alert";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [formErrors, setFormErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const fields = [
    { label: "Full Name", type: "text", placeholder: "Email", name: "email" },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      name: "password",
    },
  ];

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      setShowAlert(true);

      // Clear the state after setting the alert
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const validateForm = (loginData) => {
    const errors = {};
    if (!loginData.email) errors.email = "Email is required.";
    if (!loginData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    const errors = validateForm(loginData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      const result = await dispatch(login(loginData)); // This will now return the JWT
      console.log("Dispatch Result:", result);
      setAlert({ message: "Login successful", status: "success" });
      setShowAlert(true);
      navigate("/mentor/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.error("Login error:", errorMessage);
      setAlert({ message: errorMessage, status: "error" });
      setShowAlert(true); 
    }
  };

  return (
    <Layout
      imageSrc="/login.jpeg"
      imageAlt="Einstein Image"
      infoText="Do you know the completion rate of our courses is 84.7%? Hover aboard to know more."
    >
      <div className="w-full flex items-center">
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
      </div>
      <img src="/logo-2.png" className="h-14 w-72 self-center" />
      <p className="self-center p-5 text-orange-400">
        Sign in to your account to continue...
      </p>
      <Form
        fields={fields}
        formErrors={formErrors}
        buttonText="Sign In"
        onSubmit={handleLogin}
        noValidate
      />
      <Link
        to="/mentor/forgot-password"
        className="text-sm text-red-500 hover:underline pt-5"
      >
        Forgot Password?
      </Link>
      <p className="mt-6 text-center text-sm text-gray-600">
        Need an Account?{" "}
        <button
          onClick={() => navigate("/mentor/signup")}
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </Layout>
  );
};

export default LoginPage;
