export const saveQA = async (url, method, qaData, jwtToken) => {
    const headers = { Authorization: `Bearer ${jwtToken}` };
    return fetchAPI(url, method.toUpperCase(), qaData, headers);
  };
  