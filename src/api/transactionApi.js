import apiClient from "./client";

export function getTransactions() {
  return apiClient.get("/transactions");
}

export function getTransaction(id) {
  return apiClient.get(`/transactions/${id}`);
}

export function createTransaction(transactionData) {
  return apiClient.post("/transactions", transactionData);
}

export function updateTransaction(id, transactionData) {
  return apiClient.put(`/transactions/${id}`, transactionData);
}

export function deleteTransaction(id) {
  return apiClient.delete(`/transactions/${id}`);
}