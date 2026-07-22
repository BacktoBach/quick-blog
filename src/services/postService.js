import { apiClient, throwApiError } from "./apiClient";
import { normalizePost, unwrapItems } from "./normalizers";

export async function getPosts(params = {}) {
  try {
    const firstResponse = await apiClient.get("/posts", {
      params: { ...params, page: 1 },
    });
    const posts = unwrapItems(firstResponse);
    const totalPages = Number(firstResponse.data.totalPages) || 1;

    if (totalPages > 1) {
      const responses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          apiClient.get("/posts", { params: { ...params, page: index + 2 } }),
        ),
      );
      posts.push(...responses.flatMap(unwrapItems));
    }

    return posts.map(normalizePost);
  } catch (error) {
    throwApiError(error, "Could not load posts.");
  }
}

export async function getPost(id) {
  try {
    const { data } = await apiClient.get(`/posts/${id}`);
    return normalizePost(data);
  } catch (error) {
    throwApiError(error, "Post not found.");
  }
}

export async function createPost(payload) {
  const title = payload.title.trim();
  const content = payload.content.trim();
  const tags = (payload.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !content || !payload.coverImage) {
    throw new Error("Image, title, and content are required.");
  }

  try {
    const { data } = await apiClient.post("/posts", {
      title,
      content,
      image: payload.coverImage,
      tags: tags.length ? tags : [payload.category],
    });
    return normalizePost(data);
  } catch (error) {
    throwApiError(error, "Could not create post.");
  }
}

export async function deletePost(id) {
  try {
    const { data } = await apiClient.delete(`/posts/${id}`);
    return data;
  } catch (error) {
    throwApiError(error, "Could not delete post.");
  }
}

export function getVisiblePosts(user) {
  return user.role === "admin" ? getPosts() : getPosts({ author: user.id });
}
