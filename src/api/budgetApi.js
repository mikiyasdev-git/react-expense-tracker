import apiClient from "./client";

export function getBudgets() {
  return apiClient.get("/budgets");
}

export function getBudget(id) {
  return apiClient.get(`/budgets/${id}`);
}

export function createBudget(budgetData) {
  return apiClient.post("/budgets", budgetData);
}

export function updateBudget(id, budgetData) {
  return apiClient.put(`/budgets/${id}`, budgetData);
}

export function deleteBudget(id) {
  return apiClient.delete(`/budgets/${id}`);
}
