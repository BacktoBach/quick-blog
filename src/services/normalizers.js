export function normalizeUser(user) {
  if (!user) throw new Error("Authentication response did not include a user.");

  return {
    ...user,
    id: user.id ?? user._id,
  };
}

export function normalizePost(post) {
  if (!post) throw new Error("Post response did not include a post.");

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const author = post.author;
  const authorId = typeof author === "string" ? author : author?._id;
  const authorName = typeof author === "object" ? author?.username : undefined;

  return {
    ...post,
    id: post._id,
    category: tags[0] || "General",
    coverImage: post.image,
    authorId,
    author: authorName || "QuickBlog",
  };
}

export function unwrapItems(response) {
  return response.data.items;
}
