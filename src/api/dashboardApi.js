import apiClient from "./client";

export function getDashboardSummary() {
  return apiClient.get("/reports/summary");
}

export function getDashboardTransactions() {
  return apiClient.get("/reports/transactions");
}
