import React, { useState } from 'react';
import { adminLogin } from '../../../State/Auth/Admin/Action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alert from '../../OtherComponents/Alert';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const validationErrors = {};
    if (!email) validationErrors.email = 'Email is required.';
    if (!password) validationErrors.password = 'Password is required.';
    return validationErrors;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const loginData = { email, password };
    try {
      await dispatch(adminLogin(loginData));
      setAlert({ message: "Login successful", status: "success" });
      setShowAlert(true);
      navigate('/admin');
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
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                errors.email ? 'border-gray-500 focus:ring-gray-500' : 'border-gray-500 focus:border-indigo-500'
              }`}
            />
            {errors.email && <p className="text-gray-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                errors.password ? 'border-gray-500 focus:ring-gray-500' : 'border-gray-500 focus:border-indigo-500'
              }`}
            />
            {errors.password && <p className="text-gray-500 text-sm mt-1">{errors.password}</p>}
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

export default AdminLogin;
