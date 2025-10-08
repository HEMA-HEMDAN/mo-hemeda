import apiClient from "../lib/apiClient";

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
