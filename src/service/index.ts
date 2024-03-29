import axios from "axios";

const service = axios.create({
  baseURL: "http://xxx.xxx",
  timeout: 10000,
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

// TODO: 响应拦截

export default service;
