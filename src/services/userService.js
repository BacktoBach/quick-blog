import { apiClient, throwApiError } from "./apiClient";
import { normalizeUser, unwrapItems } from "./normalizers";

export async function getUsers() {
  try {
    const response = await apiClient.get("/users");
    return unwrapItems(response).map(normalizeUser);
  } catch (error) {
    throwApiError(error, "Could not load users.");
  }
}

export async function deleteUser(id) {
  try {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  } catch (error) {
    throwApiError(error, "Could not delete user.");
  }
}

export async function updateUserRole(id, role) {
  try {
    const { data } = await apiClient.put(`/users/${id}/role`, { role });
    return data;
  } catch (error) {
    throwApiError(error, "Could not update user role.");
  }
}
