import { API_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchAllChats = async (jwtToken, mentorId) => {
    const url = `${API_BASE_URL}/chats/mentor/${mentorId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const fetchAllChatsForStudent = async (jwtToken, studentId) => {
    const url = `${API_BASE_URL}/chats/student/${studentId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const searchMentors = async (jwtToken, studentId, query) => {
    const url = `${API_BASE_URL}/mentor/student/${studentId}/search`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const params = { query };
    return fetchAPI(url, 'GET', null, headers, params);
  };

  export const fetchMentorsByStudent = async (jwtToken, studentId) => {
    const url = `${API_BASE_URL}/mentor/student/${studentId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const createNewChat = async (jwtToken, studentId, userId2) => {
    const url = `${API_BASE_URL}/chats/${studentId}`;
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      userId2,
    };
    return fetchAPI(url, 'POST', {}, headers);
  };
  
  