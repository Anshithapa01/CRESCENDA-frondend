import { MENTOR_BASE_URL, QA_BASE_URL } from "../Config/apiConfig";
import { fetchAPI } from "./FetchApis";

export const getMaterialQualities = async (jwtToken) => {
  const url = `${QA_BASE_URL}/material/reviews/all`;
  const headers = { Authorization: `Bearer ${jwtToken}` };

  return fetchAPI(url, "GET", null, headers);
};

export const saveMaterialReview = async (
  jwtToken,
  draftId,
  modalValues,
  materialQualities
) => {
  const existingQuality = materialQualities.find(
    (quality) => quality.materialId === modalValues.materialId
  );

  const endpoint = existingQuality
    ? `${QA_BASE_URL}/material/reviews/${modalValues.materialId}` // Update review if it exists
    : `${QA_BASE_URL}/material/reviews/add?draftId=${draftId}`;
  const method = existingQuality ? "put" : "post";
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetchAPI(endpoint, method, modalValues, headers);
    return response; // If successful, return the response
  } catch (error) {
    // Extract and throw a proper error message
    if (error.response && error.response.data) {
      throw new Error(error.response.data); // Backend error message
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const fetchFirstPendingDraft = async (jwtToken, qaId) => {
  const url = `${MENTOR_BASE_URL}/draft/pending/first`;
  const headers = { Authorization: `Bearer ${jwtToken}` };
  const params = { qaId };

  return fetchAPI(url, "GET", null, headers, params);
};

export const submitCourse = async (jwtToken, draftId, requestData) => {
  const url = `${QA_BASE_URL}/tasks/submit/${draftId}`;
  const headers = { Authorization: `Bearer ${jwtToken}` };
  try {
    return fetchAPI(url, "POST", requestData, headers);
  } catch (error) {
    // Extract and throw a proper error message
    if (error.response && error.response.data) {
      throw new Error(error.response.data); // Backend error message
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const fetchCompletedTasksData = async (jwtToken) => {
  const url = `${QA_BASE_URL}/tasks/completed`;
  const headers = { Authorization: `Bearer ${jwtToken}` };

  return fetchAPI(url, "GET", null, headers);
};

export const fetchDraftTask = async (jwtToken, draftId) => {
  const url = `${QA_BASE_URL}/tasks/draft/${draftId}`;
  const headers = { Authorization: `Bearer ${jwtToken}` };

  return fetchAPI(url, "GET", null, headers);
};

export const startTask = async (jwtToken, taskId, qaExpertUID) => {
  const url = `${QA_BASE_URL}/tasks/${taskId}/start`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  };
  const data = { qaExpertUID };
  try {
    return fetchAPI(url, "POST", data, headers);
  } catch (error) {
    // Extract and throw a proper error message
    if (error.response && error.response.data) {
      throw new Error(error.response.data); // Backend error message
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
