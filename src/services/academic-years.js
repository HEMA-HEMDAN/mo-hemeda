import apiClient from "../lib/apiClient";

export async function getAcademicYears() {
  const res = await apiClient.get("/academicYear");

  return res?.data ?? [];
}

// export async function updateUser(userId, payload) {
//   const res = await apiClient.put(`/academicYear/${userId}`, payload);
//   return res?.data;
// }

// export async function deleteUser(userId) {
//   const res = await apiClient.delete(`/academicYear/${userId}`);
//   return res?.data;
// }
