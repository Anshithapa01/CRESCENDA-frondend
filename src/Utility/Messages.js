import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { CLOUDINARY_API_KEY, cloudinaryUrl } from "../Config/Cloudinary";
import { fetchAPI } from "./FetchApis";

export const fetchChatMessages = async (jwtToken, chatId) => {
    const url = `${API_BASE_URL}/messages/${chatId}`;
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, 'GET', null, headers);
  };

  export const uploadFile = async (file, preset,setUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("resource_type", "raw");
    formData.append("api_key", CLOUDINARY_API_KEY);
  
    return axios.post(cloudinaryUrl, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    }).then(response => response.data);
  };
  
  