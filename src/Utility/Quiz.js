import { QA_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchCourseQuizzes = async (jwtToken, draftId) => {
    const url = `${QA_BASE_URL}/quiz/draft/${draftId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    return fetchAPI(url, 'GET', null, headers);
  };
  