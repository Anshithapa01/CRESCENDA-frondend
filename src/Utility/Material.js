import { MENTOR_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const getMaterials = async (jwtToken, chapterId) => {
    const url = `${MENTOR_BASE_URL}/draft/chapter/material/${chapterId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    return fetchAPI(url, 'GET', null, headers);
  };
  
  