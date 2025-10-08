import apiClient from "../lib/apiClient";
export async function sibmitExam(studientId, examId, payload) {
  const res = await apiClient.post(
    `/result/${studientId}/exams/${examId}/submit`,
    payload
  );
  return res?.data;
}
export async function getResult(studientId, examId) {
  const res = await apiClient.get(
    `/result/${studientId}/exams/${examId}/result`
  );
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
