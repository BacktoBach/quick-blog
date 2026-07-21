import axios from 'axios';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const API_URL = import.meta.env.VITE_API_URL || 'https://api-blog-af3u.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  },
);

function getApiError(error, fallback = 'Something went wrong.') {
  return error.response?.data?.message || error.message || fallback;
}

function throwApiError(error, fallback) {
  throw new Error(getApiError(error, fallback), { cause: error });
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getId(item) {
  return item?._id || item?.id;
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: getId(user),
    username: user.username || user.email,
    role: user.role || 'user',
  };
}

function normalizeAuthResponse(payload) {
  return {
    token: payload.accessToken || payload.token,
    user: normalizeUser(payload.user),
  };
}

function normalizePost(post) {
  if (!post) return null;
  const author = normalizeUser(post.author);

  return {
    ...post,
    _id: post._id,
    id: getId(post),
    category: post.tags?.[0] || 'General',
    tags: post.tags || [],
    coverImage: post.image,
    authorId: author?.id,
    author: author?.username || 'QuickBlog',
  };
}

export async function registerUser(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    throwApiError(error, 'Register failed.');
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    return normalizeAuthResponse(data);
  } catch (error) {
    throwApiError(error, 'Login failed.');
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get('/auth/me');
    return normalizeUser(data.user);
  } catch (error) {
    throwApiError(error, 'Could not load current user.');
  }
}

export async function getPosts(params) {
  try {
    const { data } = await api.get('/posts', { params });
    return unwrapList(data).map(normalizePost);
  } catch (error) {
    throwApiError(error, 'Could not load posts.');
  }
}

export async function getPost(id) {
  try {
    const { data } = await api.get(`/posts/${id}`);
    return normalizePost(data.post || data);
  } catch (error) {
    throwApiError(error, 'Post not found.');
  }
}

export async function createPost(payload) {
  const title = payload.title.trim();
  const content = payload.content?.trim();
  const tags = Array.isArray(payload.tags)
    ? payload.tags
    : payload.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

  if (!title || !content || !payload.coverImage) {
    throw new Error('Image, title, and content are required.');
  }

  try {
    const { data } = await api.post('/posts', {
      title,
      content,
      image: payload.coverImage,
      tags: tags.length ? tags : [payload.category].filter(Boolean),
    });
    return normalizePost(data.post || data);
  } catch (error) {
    throwApiError(error, 'Could not create post.');
  }
}

export async function deletePost(id) {
  try {
    const { data } = await api.delete(`/posts/${id}`);
    return data;
  } catch (error) {
    throwApiError(error, 'Could not delete post.');
  }
}

export async function getVisiblePosts(user) {
  const currentUser = user || JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  if (currentUser?.role === 'admin') {
    return getPosts();
  }

  return getPosts({ author: currentUser?.id || currentUser?._id });
}

export async function getUsers() {
  try {
    const { data } = await api.get('/users');
    return unwrapList(data).map(normalizeUser);
  } catch (error) {
    throwApiError(error, 'Could not load users.');
  }
}

export async function deleteUser(id) {
  try {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  } catch (error) {
    throwApiError(error, 'Could not delete user.');
  }
}

export async function updateUserRole(id, role) {
  try {
    const { data } = await api.put(`/users/${id}/role`, { role });
    return normalizeUser(data.user || data);
  } catch (error) {
    throwApiError(error, 'Could not update user role.');
  }
}

export async function uploadCoverImage(file) {
  if (!file) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );

    return data.secure_url;
  } catch (error) {
    throwApiError(error, 'Could not upload image to Cloudinary.');
  }
}

export function isCloudinaryConfigured() {
  return Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );
}
