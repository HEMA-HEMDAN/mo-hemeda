import apiClient from "../lib/apiClient";
export async function sibmitExam(lessonId, examId, payload) {
  const res = await apiClient.post(
    `/result/${lessonId}/exams/${examId}/submit`,
    payload
  );
  return res?.data;
}
export async function getResult(lessonId, examId) {
  const res = await apiClient.get(`/result/${lessonId}/exams/${examId}/result`);
  return res?.data;
}
export async function getExamResults(examId) {
  const res = await apiClient.get(`/result/exams/${examId}`);
  return res?.data;
}
export async function getUserResults() {
  const res = await apiClient.get("/result/student");
  return res?.data;
}
