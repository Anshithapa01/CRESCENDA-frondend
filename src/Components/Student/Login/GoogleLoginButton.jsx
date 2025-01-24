import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { API_AUTH_BASE_URL } from "../../../Config/apiConfig";
import { useLocation } from "react-router-dom";

const GoogleLoginButton = () => {
  const location = useLocation();
  const login = useGoogleLogin({
    scope: "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    response_type: 'token id_token',
    prompt: 'consent',
    onSuccess: async (tokenResponse) => {
      console.log("Login function triggered id", tokenResponse);
      try {
        console.log('signin');  

        if (!tokenResponse.id_token) {
          console.error('Google credential is missing:', tokenResponse);
          alert('Google login failed. Please try again.');
          return;
        }

        const tokenInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokenResponse.access_token}`);
        console.log("Token Info:", tokenInfo.data);

        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        console.log('User Info:', userInfo.data);

        // Send token to backend for verification
        const response = await axios.post(
          `${API_AUTH_BASE_URL}/oauth2/login`,
          { token: tokenResponse.id_token },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Handle backend response
        if (response.data.jwt) {
          console.log('token', response.data.jwt);
          localStorage.setItem('token', response.data.jwt);
          alert('Login Success');
        } else {
          alert(response.data.message || 'Login Failed');
        }
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error); // Log errors
    },
  });

  const googleSignup = useGoogleLogin({
    scope: 'email profile',
    onSuccess: async (tokenResponse) => {
      console.log("Login function triggered");
      try {
        console.log('Signup');    
        const response = await axios.post(
          `${API_AUTH_BASE_URL}/oauth2/signup`,
          { token: tokenResponse.access_token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Signup Successful:', response.data);
      } catch (error) {
        console.error('Signup Error:', error.response || error.message);
      }
    },
  });

  return (
    <button
      onClick={() => {
        console.log("Google Login button clicked"); 
        location.pathname.startsWith("/login")?login():googleSignup()}}
      className="w-full flex justify-center items-center py-2 border border-gray-300 rounded hover:bg-gray-100"
    >
      <img src="google.jpeg" alt="Google Icon" className="h-5 w-auto mr-2" />
      Google
    </button>
  );
};

export default GoogleLoginButton;
