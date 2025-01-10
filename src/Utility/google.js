import { API_AUTH_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";


export const googleLogin = async () => {
    const url = `${API_AUTH_BASE_URL}/google`;
    return fetchAPI(url, 'POST', null, {});
  };