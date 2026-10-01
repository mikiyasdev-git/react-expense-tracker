import apiClient from "./client";

export function getAccounts() {
  return apiClient.get("/accounts");
}

export function getAccount(id) {
  return apiClient.get(`/accounts/${id}`);
}

export function createAccount(accountData) {
  return apiClient.post("/accounts", accountData);
}

export function updateAccount(id, accountData) {
  return apiClient.put(`/accounts/${id}`, accountData);
}

export function deleteAccount(id) {
  return apiClient.delete(`/accounts/${id}`);
}
