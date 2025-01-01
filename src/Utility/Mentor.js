import { MENTOR_AUTH_BASE_URL, MENTOR_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchMentors = async (jwtToken) => {
    const url = `${MENTOR_BASE_URL}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  export const changeBlockStatus = async (mentorId, isBlocked, jwtToken) => {
    const url = `${MENTOR_BASE_URL}/${mentorId}/${isBlocked ? "unblock" : "block"}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', {}, headers);
  };

  export const updateProfile = async (mentorId, mentorData, jwtToken) => {
    const url = `${MENTOR_BASE_URL}/${mentorId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', mentorData, headers);
  };

  export const sendForgotPasswordRequestMentor = async (email) => {
      const url = `${MENTOR_AUTH_BASE_URL}/auth/forgot-password`;
      const data = { email };
      return fetchAPI(url, 'POST', data);
    };

    export const sendResetPasswordRequestMentor = async (token, password) => {
      const url = `${MENTOR_AUTH_BASE_URL}/auth/reset-password`;
      const data = { token, password };
    
      return fetchAPI(url, 'POST', data);
    };
    
  