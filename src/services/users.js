import apiClient from "../lib/apiClient";

export async function getUsers() {
  const res = await apiClient.get("/users");

  return res?.data?.data?.users ?? [];
}

export async function updateUser(userId, payload) {
  const res = await apiClient.put(`/users/${userId}`, payload);
  return res?.data;
}

export async function deleteUser(userId) {
  const res = await apiClient.delete(`/users/${userId}`);
  return res?.data;
}
