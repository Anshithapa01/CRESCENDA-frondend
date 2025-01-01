import { MENTOR_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const fetchCourseMaterials = async (jwtToken, courseId) => {
    const url = `${MENTOR_BASE_URL}/draft/chapters/${courseId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
  
    const chapters = await fetchAPI(url, 'GET', null, headers);
    return chapters.flatMap((chapter) => chapter.materials || []);
  };
  