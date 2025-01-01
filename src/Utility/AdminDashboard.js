import { ADMIN_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchDailyTotals = async (jwtToken, fromDate, toDate) => {
    const url = `${ADMIN_BASE_URL}/daily-totals`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const params = { fromDate, toDate };
    return fetchAPI(url, 'GET', null, headers, params);
  };
  
  export const fetchDashboard = async (jwtToken) => {
    const url = `${ADMIN_BASE_URL}/dashboard`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  export const fetchTopSelling = async (jwtToken) => {
    const url = `${ADMIN_BASE_URL}/top-selling`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  