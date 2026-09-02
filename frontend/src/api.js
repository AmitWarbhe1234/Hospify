import axios from "axios";

const BASE_URL = "https://hospify-rut5.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor - attach access token to every request
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - if access token is expired/invalid (401),
// silently use the refresh token to get a new access token and
// retry the original request. Only logs the user out if the
// refresh token itself is missing/expired.
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // some SimpleJWT configs (ROTATE_REFRESH_TOKENS) also return a new refresh token
        if (res.data.refresh) {
          localStorage.setItem("refresh_token", res.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
