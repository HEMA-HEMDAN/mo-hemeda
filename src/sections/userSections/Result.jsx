import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getResult } from "../../services/rusult";
import { getLessonById } from "../../services/lessons";
import Loading from "../../components/rusable/Loading";
const Result = () => {
  // there some work to do here you should refactor the maped object to match the responde and use the date of the exam to get the date of the result
  // and the time of the exam to get the time of the result and use that to make conditions for showing the result
  useEffect(() => {
    document.title = "Result";
  }, []);
  const { examId } = useParams();
  const location = useLocation();
  const lessonId = location?.state?.lessonId || null;

  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Backend extracts userId from token header
      const res = await getResult(lessonId, examId);
      setResult(res);

      if (lessonId) {
        const lesson = await getLessonById(lessonId);
        const found = (lesson?.exams || []).find(
          (e) => (e._id || e.id) === examId
        );
        setExam(found || null);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load result");
    } finally {
      setLoading(false);
    }
  }, [examId, lessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const answersByQuestionId = useMemo(() => {
    const map = new Map();
    const items = result?.answers || [];
    for (const item of items) {
      const key = item.questionId ?? item.questionIndex;
      map.set(key, item.answer);
    }
    return map;
  }, [result]);

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading result...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </section>
    );
  }

  return (
    <>
      <Loading />
      <div className="min-h-screen mt-20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Exam Result
          </h1>
          <div className="text-gray-300 mt-2 text-sm">
            Score: <span className="font-semibold text-[#c5f10f]">{result?.score ?? 0}</span>
          </div>
        </div>

        {exam ? (
          <div className="space-y-6">
            {exam.questions?.map((q, index) => {
              const qId = q._id || q.id || index;
              const userAnswer = answersByQuestionId.get(qId);
              const isCorrect =
                String(userAnswer).toLowerCase() ===
                String(q.correctAnswer).toLowerCase();
              return (
                <div
                  key={qId}
                  className="bg-[#1b232e]/80 backdrop-blur rounded-xl shadow border border-[#c5f10f]/20 p-4"
                >
                  <div className="font-medium text-white mb-3">
                    Q{index + 1}. {q.questionText}
                  </div>
                  <div className="text-sm text-gray-300">
                    <div className="mb-1">
                      Your answer:{" "}
                      <span className="font-semibold">
                        {String(userAnswer ?? "-")}
                      </span>
                    </div>
                    {q.correctAnswer !== undefined &&
                      q.correctAnswer !== null && (
                        <div>
                          Correct answer:{" "}
                          <span className="font-semibold">
                            {String(q.correctAnswer)}
                          </span>
                        </div>
                      )}
                    <div
                      className={`mt-2 font-semibold ${
                        isCorrect ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">Exam details unavailable.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default Result;
