import React, { useState } from 'react';
import { qaLogin } from '../../../State/Auth/QA/Action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alert from '../../OtherComponents/Alert';

const QALogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setErrors({});
    const loginData = { email, password };
    await dispatch(qaLogin(loginData))
        .then(() => {
          setAlert({ message: "Login successful", status: "success" });
          setShowAlert(true);
          navigate('/qa/dashboard');
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
          setAlert({ message: errorMessage, status: "error" });
          setShowAlert(true);
        });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-100 via-orange-200 to-orange-300">
      <div className="bg-orange-400 p-8 rounded-lg shadow-lg w-96">
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
        <h2 className="text-2xl font-bold mb-6 text-center text-white">QA Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-white border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default QALogin;
