import React, { useState } from "react";
import Layout from "../../OtherComponents/Layout";
import Form from "../../OtherComponents/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../../State/Auth/Mentor/Action";
import Alert from "../../OtherComponents/Alert";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const [formErrors, setFormErrors] = useState({});
  const fields = [
    {
      label: "First Name",
      type: "text",
      placeholder: "First Name",
      name: "firstName",
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Last Name",
      name: "lastName",
    },
    {
      label: "Email Address",
      type: "email",
      placeholder: "Email Address",
      name: "email",
    },
    { label: "Phone", type: "tel", placeholder: "Phone", name: "phone" },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      name: "password",
    },
    {
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm Password",
      name: "confirmPassword",
    },
  ];

  const validateForm = (mentorData) => {
    const errors = {};
    if (!mentorData.firstName) errors.firstName = "First name is required.";
    if (!mentorData.lastName) errors.lastName = "Last name is required.";
    if (!mentorData.emailId) errors.emailId = "Email is required.";
    if (!mentorData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!mentorData.password) errors.password = "Password is required.";
    if (mentorData.password !== mentorData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const mentorData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      emailId: data.get("email"),
      phoneNumber: data.get("phone"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };

    const errors = validateForm(mentorData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    try {
      console.log(mentorData);
      await dispatch(register(mentorData));
      setAlert({ message: "Signup successful", status: "success" });
      setShowAlert(true);
      navigate("/mentor/dashboard");
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
    <Layout
      imageSrc="../../../public/signup.jpg"
      imageAlt="Teacher Image"
      infoText="Do you know you can also become an Instructor and earn side cash? It's easy! Create an account to unlock a milestone."
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
      <img src="../../../public/logo-2.png" className="h-14 w-72 self-center" />
      <p className="self-center p-5 text-orange-400">
        Please create your new account here...
      </p>
      <Form fields={fields} buttonText="Sign Up" onSubmit={handleSignUp} formErrors={formErrors} noValidate/>
      <p className="mt-4 text-center text-sm">
        Already have an Account?{" "}
        <button
          onClick={() => navigate("/mentor/login")}
          className="text-indigo-500 hover:underline"
        >
          Sign in
        </button>
      </p>
    </Layout>
  );
};

export default SignUpPage;
