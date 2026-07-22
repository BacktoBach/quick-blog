import axios from "axios";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://api-blog-af3u.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);

export function getApiError(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

export function throwApiError(error, fallback) {
  throw new Error(getApiError(error, fallback), { cause: error });
}

export { apiClient, TOKEN_KEY, USER_KEY };
