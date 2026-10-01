import apiClient from "./client";

export function login(credentials) {
  return apiClient.post("/login", credentials);
}

export function register(userData) {
  return apiClient.post("/register", userData);
}

export function logout() {
  return apiClient.post("/logout");
}

export function getCurrentUser() {
  return apiClient.get("/user");
}