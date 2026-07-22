import { apiClient, throwApiError, TOKEN_KEY } from "./apiClient";
import { normalizeUser } from "./normalizers";

function normalizeAuthResponse(data) {
  if (!data.accessToken) {
    throw new Error("Authentication response did not include an access token.");
  }

  return { token: data.accessToken };
}

async function authenticate(endpoint, payload) {
  try {
    const { data } = await apiClient.post(endpoint, payload);
    const auth = normalizeAuthResponse(data);

    // The login/register response contains only tokens. Store the access token
    // temporarily so the auth/me request can attach it to its Authorization header.
    localStorage.setItem(TOKEN_KEY, auth.token);
    const user = await getCurrentUser();

    return { ...auth, user };
  } catch (error) {
    localStorage.removeItem(TOKEN_KEY);
    throwApiError(error, "Authentication failed.");
  }
}

export async function registerUser(payload) {
  return authenticate("/auth/register", payload);
}

export async function loginUser(payload) {
  return authenticate("/auth/login", payload);
}

export async function getCurrentUser() {
  try {
    const { data } = await apiClient.get("/auth/me");
    return normalizeUser(data.user || data);
  } catch (error) {
    throwApiError(error, "Could not load current user.");
  }
}
