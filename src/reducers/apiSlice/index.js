import axios from "axios";

export const authApiSlice = axios.create({
  baseURL: "http://www.messaging-app-prod.chat/auth-service",
});

export const userApiSlice = axios.create({
  baseURL: "http://www.messaging-app-prod.chat/user-service",
});
