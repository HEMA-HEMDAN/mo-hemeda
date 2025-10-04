import apiClient from "../lib/apiClient";

export async function getAcademicYears() {
  const res = await apiClient.get("/academicYear");

  return res?.data ?? [];
}

export async function createAcademicYear(data) {
  const res = await apiClient.post("/academicYear", data);
  return res?.data;
}

export async function updateAcademicYear(id, data) {
  const res = await apiClient.put(`/academicYear/${id}`, data);
  return res?.data;
}

export async function deleteAcademicYear(id) {
  const res = await apiClient.delete(`/academicYear/${id}`);
  return res?.data;
}
