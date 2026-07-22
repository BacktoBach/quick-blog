import { apiClient, throwApiError } from "./apiClient";
import { normalizeUser } from "./normalizers";

function normalizeAuthResponse(data) {
  // The API returns the token alongside the authenticated user payload.
  return { token: data.accessToken, user: normalizeUser(data.user ?? data) };
}

export async function registerUser(payload) {
  try {
    const { data } = await apiClient.post("/auth/register", payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    throwApiError(error, "Register failed.");
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await apiClient.post("/auth/login", payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    throwApiError(error, "Login failed.");
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await apiClient.get("/auth/me");
    return normalizeUser(data.user);
  } catch (error) {
    throwApiError(error, "Could not load current user.");
  }
}
