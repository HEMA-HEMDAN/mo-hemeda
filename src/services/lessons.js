import apiClient from "../lib/apiClient";
import axios from "axios";
const API_KEY = import.meta.env.VITE_API_KEY;
export async function getLessonsByYearId(yearId) {
  const res = await apiClient.get(`/lessons/?yearId=${yearId}`);
  return res?.data ?? [];
}
export async function getLessonById(lessonId) {
  const res = await apiClient.get(`/lessons/${lessonId}`);
  return res?.data ?? [];
}
export async function createLesson(payload) {
  const res = await apiClient.post(`/lessons`, payload);
  return res?.data;
}
export async function postQuestionImage(image) {
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
export async function createNewExam(lessonId, payload) {
  const res = await apiClient.post(`/lessons/${lessonId}/exams`, payload);
  return res?.data;
}

export async function updateLesson(lessonId, payload) {
  const res = await apiClient.put(`/lessons/${lessonId}`, payload);
  return res?.data;
}
export async function updateExam(lessonId, examId, payload) {
  const res = await apiClient.put(
    `/lessons/${lessonId}/exams/${examId}`,
    payload
  );
  return res?.data;
}
export async function deleteLesson(lessonId) {
  const res = await apiClient.delete(`/lessons/${lessonId}`);
  return res?.data;
}

export async function deleteExam(lessonId, examId) {
  const res = await apiClient.delete(`/lessons/${lessonId}/exams/${examId}`);
  return res?.data;
}
