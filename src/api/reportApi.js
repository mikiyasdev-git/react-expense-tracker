import apiClient from "./client";

export function getReportSummary() {
  return apiClient.get("/reports/summary");
}

export function getReportTransactions() {
  return apiClient.get("/reports/transactions");
}