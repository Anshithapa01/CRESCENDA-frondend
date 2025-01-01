import axios from 'axios';
import React, { useState } from 'react';
import { API_AUTH_BASE_URL, MENTOR_AUTH_BASE_URL } from '../../../Config/apiConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      let response = null;
      if (location.pathname.startsWith('/mentor')) 
            response = await axios.post(`${MENTOR_AUTH_BASE_URL}/auth/forgot-password`, { email });
      else
        response = await axios.post(`${API_AUTH_BASE_URL}/auth/forgot-password`, { email });
    
      console.log(response);
      
      if (response.status === 200) {
        setMessage('Reset password link sent to your email.');
      } else {
        const result = await response.json();
        setError(result.message || 'Error occurred. Please try again.');
      }
    } catch (err) {
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
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-600 mb-4">
          Enter your email address and we will send you a link to reset your password.
        </p>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
