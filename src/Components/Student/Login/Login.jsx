// Login.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../OtherComponents/Button";
import { useDispatch } from "react-redux";
import { login, testLog } from "../../../State/Auth/User/Action";
import Alert from "../../OtherComponents/Alert";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const [formErrors, setFormErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
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
      // await dispatch(login(loginData));
      dispatch(testLog());
      setAlert({ message: "Login success", status: "success" });
      setShowAlert(true);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      console.log(errorMessage);
      setAlert({ message: errorMessage, status: "error" });
      setShowAlert(true);
    }
  };

  return (
    <div className="flex h-screen  from-orange-100 to-orange-300">
      <div className="flex flex-col w-full max-w-md p-8 self-center mx-auto">
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
        <div className="flex justify-center mb-6">
          <img src="logo-2.png" alt="Crescenda Logo" className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Username or Email ID"
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                formErrors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className={`w-full px-4 py-2 border rounded focus:outline-none ${
                formErrors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Button text={"Sign in ->"} />
            <Link
              to="/forgot-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500">Sign in with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button className="w-full flex justify-center items-center py-2 border border-gray-300 rounded hover:bg-gray-100">
          <img
            src="google.jpeg"
            alt="Google Icon"
            className="h-5 w-auto mr-2"
          />
          Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Need an Account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>

      <div
        className="hidden lg:block w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('student-login.jpg')" }}
      ></div>
    </div>
  );
};

export default Login;
