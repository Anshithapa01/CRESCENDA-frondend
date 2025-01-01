import { ADMIN_BASE_URL, MENTOR_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchAllPurchases = async (jwtToken) => {
    const url = `${ADMIN_BASE_URL}/all-purchases`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const fetchPurchases = async (jwtToken, mentorId) => {
    const url = `${MENTOR_BASE_URL}/mentor-dashboard/${mentorId}/purchases`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const fetchEarnings = async (jwtToken, mentorId, fromDate, toDate) => {
    const url = `${MENTOR_BASE_URL}/mentor-dashboard/${mentorId}/earnings`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const params = { fromDate, toDate };
    return fetchAPI(url, 'GET', null, headers, params);
  };

  export const fetchMentorDashboardData = async (jwtToken, mentorId) => {
    const url = `${MENTOR_BASE_URL}/mentor-dashboard/${mentorId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  
  