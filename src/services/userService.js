import { apiClient, throwApiError } from "./apiClient";
import { normalizeUser, unwrapItems } from "./normalizers";

export async function getUsers() {
  try {
    const firstResponse = await apiClient.get("/users", {
      params: { page: 1 },
    });
    const users = unwrapItems(firstResponse);
    const totalPages = Number(firstResponse.data.totalPages) || 1;

    if (totalPages > 1) {
      const responses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          apiClient.get("/users", { params: { page: index + 2 } }),
        ),
      );
      users.push(...responses.flatMap(unwrapItems));
    }

    return users.map(normalizeUser);
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
