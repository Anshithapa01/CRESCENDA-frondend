import { ADMIN_AUTH_BASE_URL, ADMIN_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchCategories = async (jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  
  export const fetchCategory = async () => {
    const url = `${ADMIN_AUTH_BASE_URL}/category`;
    return fetchAPI(url, 'GET', null);
  };

  export const addCategory = async (categoryData, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/add`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'POST', categoryData, headers);
  };
  
  export const updateCategory = async (categoryId, categoryData, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', categoryData, headers);
  };
  
  export const toggleBlockCategory = async (categoryId, isDeleted, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/block/${categoryId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', {isDeleted}, headers);
  };
  