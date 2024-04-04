import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

service.interceptors.request.use(
  // 请求拦截, 在请求头中加入token
  (config) => {
    if (localStorage.getItem("token"))
      config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("请求超时");
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default service;
