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
export async function newUser(data) {
  const res = await apiClient.post("/users/register", data);
  return res?.data;
}
export async function login(data) {
  const res = await apiClient.post("/users/login", data);
  return res?.data;
}
