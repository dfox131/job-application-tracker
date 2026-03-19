import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api/applications", "") ||
  "http://localhost:4000";

const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

export async function registerUser(payload) {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, payload);
  return response.data;
}

export async function getCurrentUser(token) {
  const response = await axios.get(`${AUTH_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
