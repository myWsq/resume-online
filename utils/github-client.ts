import axios from "axios";
export const ACCESS_TOKEN_KEY = "resume_online_access_token";

export const githubAxios = axios.create({
  headers: {
    accept: "application/json",
  },
});

githubAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken && config.headers) {
    config.headers["Authorization"] = "token " + accessToken;
  }
  return config;
});
