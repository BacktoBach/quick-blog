export function normalizeUser(user) {
  if (!user) throw new Error("Authentication response did not include a user.");
  return {
    ...user,
    id: user._id,
    username: user.username,
    role: user.role,
  };
}

export function normalizePost(post) {
  return {
    ...post,
    id: post._id,
    category: post.tags[0] || "General",
    coverImage: post.image,
    authorId: post.author._id,
    author: post.author.username,
  };
}

export function unwrapItems(response) {
  return response.data.items;
}
