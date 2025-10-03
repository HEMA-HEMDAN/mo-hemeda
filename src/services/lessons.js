import apiClient from "../lib/apiClient";

export async function getLessonsByYearId(yearId) {
  const res = await apiClient.get(`lessons/?yearId=${yearId}`);
  return res?.data ?? [];
}

export async function createLesson(payload) {
 
  const res = await apiClient.post(`/lessons`, payload);
  return res?.data;
}




