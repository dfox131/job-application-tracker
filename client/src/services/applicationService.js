import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/applications";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getApplications() {
  const response = await axios.get(API_BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function getApplicationById(id) {
  const response = await axios.get(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function createApplication(payload) {
  const response = await axios.post(API_BASE_URL, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function updateApplication(id, payload) {
  const response = await axios.put(`${API_BASE_URL}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function deleteApplication(id) {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}
