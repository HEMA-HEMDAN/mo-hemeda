import apiClient from "../lib/apiClient";

export async function getAcademicYears() {
  const res = await apiClient.get("/academicYear");

  return res?.data ?? [];
}

export async function createAcademicYear({ title, telegramChannel, image }) {
  const form = new FormData();
  if (title) form.append("title", title);
  if (telegramChannel) form.append("telegramChannel", telegramChannel);
  if (image) form.append("image", image);
  const res = await apiClient.post("/academicYear", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res?.data;
}

export async function updateAcademicYear(id, { title, telegramChannel, image }) {
  const form = new FormData();
  if (title !== undefined) form.append("title", title);
  if (telegramChannel !== undefined) form.append("telegramChannel", telegramChannel);
  if (image) form.append("image", image);
  const res = await apiClient.put(`/academicYear/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res?.data;
}

export async function deleteAcademicYear(id) {
  const res = await apiClient.delete(`/academicYear/${id}`);
  return res?.data;
}