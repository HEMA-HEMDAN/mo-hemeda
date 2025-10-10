import apiClient from "../lib/apiClient";
import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY;
export async function getAcademicYears() {
  const res = await apiClient.get("/academicYear");
  return res?.data ?? [];
}
export async function postAcademicYearImage(image) {
  const formData = new FormData();
  if (image) {
    formData.append("image", image);
  }
  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${API_KEY}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res?.data;
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
