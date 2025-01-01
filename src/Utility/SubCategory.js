import { ADMIN_AUTH_BASE_URL, ADMIN_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchSubCategories = async (categoryId, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}/subcategories`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const fetchSubCategory = async (categoryId) => {
    const url = `${ADMIN_AUTH_BASE_URL}/category/${categoryId}/subcategories`;
    return fetchAPI(url, 'GET', null);
  };
  
  export const addSubCategory = async (categoryId, subCategoryData, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}/subcategories`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'POST', subCategoryData, headers);
  };
  
  export const updateSubCategory = async (categoryId, subCategoryId, subCategoryData, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}/subcategories/${subCategoryId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', subCategoryData, headers);
  };
  
  export const toggleSubCategoryBlock = async (categoryId, subCategoryId, isDeleted, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}/subcategories/block/${subCategoryId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', { isDeleted }, headers);
  };
  
  export const fetchSubCategoryDetails = async (categoryId, subCategoryId, jwtToken) => {
    const url = `${ADMIN_BASE_URL}/category/${categoryId}/subcategories/${subCategoryId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };
  