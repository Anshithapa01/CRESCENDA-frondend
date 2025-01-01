import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { API_AUTH_BASE_URL, MENTOR_AUTH_BASE_URL } from '../../../Config/apiConfig';
import axios from 'axios';
import { sendResetPasswordRequestStudent } from '../../../Utility/Student';
import { sendResetPasswordRequestMentor } from '../../../Utility/Mentor';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate=useNavigate();
  const location=useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    try {
        let response = null;
      if (location.pathname.startsWith('/mentor')) 
            response = await axios.post(`${MENTOR_AUTH_BASE_URL}/auth/reset-password`, {token, password});
         else 
            response = await axios.post(`${API_AUTH_BASE_URL}/auth/reset-password`, {token, password});
        
        
        // Check for success
        if (response.status === 200) {
            setMessage('Password has been reset successfully.');
            if (location.pathname.startsWith('/mentor')) 
                navigate('/mentor/login', {
                    state: { alert: { message: 'Password changed successfully!', status: 'success' } },
                  });
            else
                navigate('/login', {
                    state: { alert: { message: 'Password changed successfully!', status: 'success' } },
                  });
        } else if (response && response.data && response.data.message) {
            setError(response.data.message);
        } else {
            setError('Error occurred. Please try again.');
        }
    } catch (err) {
        // Check for detailed error message from the server
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError('Server error. Please try again later.');
        }
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded-md mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full p-2 border rounded-md mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
