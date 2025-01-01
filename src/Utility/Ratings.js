import { API_AUTH_BASE_URL, API_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchRatings = (courseId) => {
    const url = `${API_AUTH_BASE_URL}/ratings/course/${courseId}`;
    return fetchAPI(url,'GET',null);
  };

  export const checkRatingStatus = (courseId, studentId) => {
    const url = `${API_AUTH_BASE_URL}/ratings/status`;
    const params = { courseId, studentId };
    return fetchAPI(url, 'GET', null, {}, params);
  };