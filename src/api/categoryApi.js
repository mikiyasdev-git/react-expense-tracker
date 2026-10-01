import apiClient from "./client";

export function getCategories() {
  return apiClient.get("/categories");
}

export function getCategory(id) {
  return apiClient.get(`/categories/${id}`);
}

export function createCategory(categoryData) {
  return apiClient.post("/categories", categoryData);
}

export function updateCategory(id, categoryData) {
  return apiClient.put(`/categories/${id}`, categoryData);
}

export function deleteCategory(id) {
  return apiClient.delete(`/categories/${id}`);
}
