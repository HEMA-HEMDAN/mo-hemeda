import apiClient from "../lib/apiClient";
//  ====================admin functions only===============//
export async function getUsers() {
  const res = await apiClient.get("/users").catch((e) => {
    console.error(e);
  });

  return res?.data?.data?.users ?? [];
}

export async function updateUser(userId, payload) {
  const res = await apiClient.put(`/users/${userId}`, payload).catch((e) => {
    console.error(e);
  });
  return res?.data;
}

export async function deleteUser(userId) {
  const res = await apiClient.delete(`/users/${userId}`).catch((e) => {
    console.error(e);
  });
  return res?.data;
}
// =====================public functions ===============//
export async function newUser(data) {
  const res = await apiClient.post("/users/register", data).catch((e) => {
    console.error(e);
  });
  return res?.data;
}
export async function login(data) {
  const res = await apiClient.post("/users/login", data).catch((e) => {
    console.error(e);
  });
  return res?.data;
}
