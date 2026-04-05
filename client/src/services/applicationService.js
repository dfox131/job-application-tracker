import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const APPLICATIONS_API_URL = `${API_URL}/api/applications`;
const JOBS_API_URL = `${API_URL}/api/jobs`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getApplications() {
  const response = await axios.get(APPLICATIONS_API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function getApplicationById(id) {
  const response = await axios.get(`${APPLICATIONS_API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function createApplication(payload) {
  const response = await axios.post(APPLICATIONS_API_URL, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function updateApplication(id, payload) {
  const response = await axios.put(`${APPLICATIONS_API_URL}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function deleteApplication(id) {
  const response = await axios.delete(`${APPLICATIONS_API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function extractJobDescription(jobLink) {
  const response = await axios.post(
    `${JOBS_API_URL}/extract`,
    { jobLink },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}

export async function analyzeApplication(id, resumeText) {
  const response = await axios.post(
    `${APPLICATIONS_API_URL}/${id}/analyze`,
    { resumeText },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data;
}
