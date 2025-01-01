import { ADMIN_BASE_URL, API_AUTH_BASE_URL, API_BASE_URL, MENTOR_BASE_URL, QA_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchAllCourses = async (jwtToken) => {
    const url = `${API_AUTH_BASE_URL}/courses`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null);
  };

  export const addDraft = async (jwtToken, formData) => {
    const url = `${MENTOR_BASE_URL}/draft/add`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    };
  
    return fetchAPI(url, "POST", formData, headers);
  };
  
  export const deleteCourse=async(jwtToken,courseId)=>{
    const url = `${ADMIN_BASE_URL}/courses/${courseId}/block`
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'PUT', null, headers);
  }

  export const getCourseDraft = async (jwtToken, id) => {
    const url = `${MENTOR_BASE_URL}/draft/${id}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    return fetchAPI(url, 'GET', null, headers);
  };
  
  export const publishCourse = async (jwtToken, taskId) => {
    const url = `${ADMIN_BASE_URL}/courses/create`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const params = { taskId };
  
    return fetchAPI(url, 'POST', {}, headers, params);
  };
  
  export const rejectTask = async (jwtToken, taskId) => {
    const url = `${QA_BASE_URL}/tasks/reject/${taskId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    return fetchAPI(url, 'PUT', {}, headers);
  };
  
  export const sendToUpdate = async (jwtToken, taskId) => {
    const url = `${QA_BASE_URL}/tasks/update/${taskId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    return fetchAPI(url, 'PUT', {}, headers);
  };
  