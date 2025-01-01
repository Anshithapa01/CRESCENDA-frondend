import { API_AUTH_BASE_URL, API_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const updateBlockStatus = async (studentId, isBlocked, jwtToken) => {
    const url=`${API_BASE_URL}/student/${studentId}/${isBlocked ? "unblock" : "block"}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', {}, headers);
  };

  export const fetchStudents = async (jwtToken) => {
    const url = `${API_BASE_URL}/student`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  export const sendForgotPasswordRequestStudent = async (email) => {
    const url = `${API_AUTH_BASE_URL}/auth/forgot-password`;
    const data = { email };
  
    return fetchAPI(url, 'POST', data);
  };
  
  export const sendResetPasswordRequestStudent = async (token, password) => {
    const url = `${API_AUTH_BASE_URL}/auth/reset-password`;
    const data = { token, password };
  
    return fetchAPI(url, 'POST', data);
  };
  
  