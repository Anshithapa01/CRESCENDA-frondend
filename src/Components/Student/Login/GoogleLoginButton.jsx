import React from "react";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID = "393207149497-4kjsc46e2vvbrvscm61qj7pv0cbvfjol.apps.googleusercontent.com";

const GoogleLoginButton = ({ onSuccess }) => {
  const handleLoginSuccess = (response) => {
    console.log("Google Login Successful:", response);
    onSuccess(response.tokenId); // Pass the token to your backend.
  };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginButton;
