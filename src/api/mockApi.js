import axios from 'axios';

const STORAGE_KEY = 'quick_blog_mock_db';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REAL_BLOG_API = 'https://blog-backend-dusky-eight.vercel.app/api';

const api = axios.create({
  baseURL: REAL_BLOG_API,
});

const seedUsers = [
  {
    id: 'u-admin',
    email: 'admin@quickblog.dev',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'u-user',
    email: 'user@quickblog.dev',
    username: 'demo',
    password: 'user123',
    role: 'user',
  },
];

const seedPosts = [
  {
    _id: 'local-1',
    title: 'Welcome to the local Quick Blog flow',
    content:
      '<p>This post lives in the mock API. It exists so auth, ownership, create, and delete can be tested without a real backend.</p>',
    category: 'Technology',
    tags: 'react,auth,mock-api',
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    authorId: 'u-admin',
    author: 'admin',
    createdAt: new Date().toISOString(),
    views: 128,
  },
  {
    _id: 'local-2',
    title: 'A user owned draft-style article',
    content:
      '<p>This article belongs to the demo user. Login as demo to see the ownership rule in action.</p>',
    category: 'Lifestyle',
    tags: 'writing,demo',
    coverImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    authorId: 'u-user',
    author: 'demo',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    views: 44,
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createToken(user) {
  return `mock-jwt-${user.id}-${Date.now()}`;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getDb() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
  if (saved?.users && saved?.posts) return saved;

  const db = { users: clone(seedUsers), posts: clone(seedPosts) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function publicUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

function getStoredUser() {
  return safeParse(localStorage.getItem(USER_KEY), null);
}

function requireAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getStoredUser();
  if (!token || !user) {
    throw new Error('You need to login first.');
  }
  return user;
}

function normalizeRemotePost(post) {
  return {
    _id: post._id,
    title: post.title,
    content: post.content || post.description || '',
    category: post.category || 'General',
    tags: post.tags || '',
    coverImage: post.coverImage || post.image || post.thumbnail || '',
    authorId: post.authorId || 'remote',
    author: post.author || 'QuickBlog',
    createdAt: post.createdAt || post.date || new Date().toISOString(),
    views: post.views || 0,
    remote: true,
  };
}

export async function registerUser(payload) {
  await delay();
  const db = getDb();
  const email = payload.email.trim().toLowerCase();
  const username = payload.username.trim();
  const password = payload.password.trim();

  if (!email || !username || password.length < 4) {
    throw new Error('Please enter a valid email, username, and password.');
  }

  if (db.users.some((user) => user.email === email || user.username === username)) {
    throw new Error('Email or username already exists.');
  }

  const user = {
    id: `u-${crypto.randomUUID()}`,
    email,
    username,
    password,
    role: 'user',
  };

  db.users.push(user);
  saveDb(db);

  const token = createToken(user);
  return { token, user: publicUser(user) };
}

export async function loginUser({ email, password }) {
  await delay();
  const db = getDb();
  const login = email.trim().toLowerCase();
  const user = db.users.find(
    (item) =>
      (item.email.toLowerCase() === login || item.username.toLowerCase() === login) &&
      item.password === password,
  );

  if (!user) {
    throw new Error('Invalid email/username or password.');
  }

  const token = createToken(user);
  return { token, user: publicUser(user) };
}

export async function getPosts() {
  await delay();
  const db = getDb();

  try {
    const { data } = await api.get('/blog/all');
    const remotePosts = Array.isArray(data?.blogs) ? data.blogs.map(normalizeRemotePost) : [];
    return [...db.posts, ...remotePosts];
  } catch {
    return db.posts;
  }
}

export async function getPost(id) {
  const posts = await getPosts();
  const post = posts.find((item) => item._id === id);
  if (!post) throw new Error('Post not found.');
  return post;
}

export async function createPost(payload) {
  await delay();
  const user = requireAuth();
  const db = getDb();
  const title = payload.title.trim();

  if (!title || !payload.content?.trim()) {
    throw new Error('Title and content are required.');
  }

  const post = {
    _id: `local-${crypto.randomUUID()}`,
    ...payload,
    title,
    authorId: user.id,
    author: user.username,
    createdAt: new Date().toISOString(),
    views: 0,
  };

  db.posts.unshift(post);
  saveDb(db);
  return post;
}

export async function deletePost(id) {
  await delay();
  const user = requireAuth();
  const db = getDb();
  const post = db.posts.find((item) => item._id === id);

  if (!post) {
    throw new Error('Remote public API posts are read-only in this demo.');
  }

  if (user.role !== 'admin' && post.authorId !== user.id) {
    throw new Error('You can only delete your own posts.');
  }

  db.posts = db.posts.filter((item) => item._id !== id);
  saveDb(db);
  return { success: true };
}

export async function getVisiblePosts() {
  const user = requireAuth();
  const posts = await getPosts();
  return user.role === 'admin' ? posts : posts.filter((post) => post.authorId === user.id);
}

export async function getUsers() {
  await delay();
  const user = requireAuth();
  if (user.role !== 'admin') throw new Error('Admin only.');
  return getDb().users.map(publicUser);
}

export async function deleteUser(id) {
  await delay();
  const user = requireAuth();
  if (user.role !== 'admin') throw new Error('Admin only.');
  if (id === user.id) throw new Error('You cannot delete your own account.');

  const db = getDb();
  db.users = db.users.filter((item) => item.id !== id);
  db.posts = db.posts.filter((post) => post.authorId !== id);
  saveDb(db);
  return { success: true };
}

export async function updateUserRole(id, role) {
  await delay();
  const user = requireAuth();
  if (user.role !== 'admin') throw new Error('Admin only.');
  if (id === user.id) throw new Error('You cannot change your own role.');

  const db = getDb();
  const targetUser = db.users.find((item) => item.id === id);
  if (!targetUser) throw new Error('User not found.');

  db.users = db.users.map((item) => (item.id === id ? { ...item, role } : item));
  saveDb(db);
  return publicUser(db.users.find((item) => item.id === id));
}

export async function uploadCoverImage(file) {
  if (!file) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'quick-blog');

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
    );
    return data.secure_url;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Cannot read selected image.'));
    reader.readAsDataURL(file);
  });
}

export function isCloudinaryConfigured() {
  return Boolean(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );
}

export const demoAccounts = [
  { label: 'Admin', login: 'admin@quickblog.dev', password: 'admin123' },
  { label: 'User', login: 'user@quickblog.dev', password: 'user123' },
];
