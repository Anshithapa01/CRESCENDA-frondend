import axios from "axios";

export const fetchAPI = async (url, method = 'GET', data = null, headers = {}, params=  {}) => {
    try {
      const response = await axios({ url, method, data, headers,params });
      return response.data;
    } catch (error) {
      console.error(`Error during API call to ${url}:`, error);
      throw error;
    }
  };