import { MENTOR_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchAllDrafts = async (jwtToken,mentorId) => {
    const url = `${MENTOR_BASE_URL}/draft/${mentorId}/active`
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null,headers);
  };