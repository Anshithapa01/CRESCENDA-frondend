import { API_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const addToWishlist=async(jwtToken,studentId)=>{
    const url = `${API_BASE_URL}/wishlist/${studentId}`
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  }

  export const checkWishlistStatus = (courseId, studentId, jwtToken) => {
    const url = `${API_BASE_URL}/wishlist/status/${courseId}/${studentId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const toggleWishlist = (courseId, studentId, jwtToken) => {
    const url = `${API_BASE_URL}/wishlist/toggle`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const data = { courseId, studentId };
    return fetchAPI(url, 'POST', data, headers);
  };