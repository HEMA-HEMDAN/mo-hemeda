import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { sibmitExam } from "../../services/rusult";
import { getLessonById } from "../../services/lessons";

const UserExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedExam = location?.state?.exam || null;
  const lessonId = location?.state?.lessonId || null;

  const [exam, setExam] = useState(passedExam);
  const [loading, setLoading] = useState(!passedExam);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchExam = useCallback(async () => {
    if (passedExam) return;
    // Fallback: try to get exam from its lesson if lessonId present
    if (!lessonId) {
      setLoading(false);
      setError("Unable to load exam. Return to lesson and start again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const lesson = await getLessonById(lessonId);
      const found = (lesson?.exams || []).find(
        (e) => (e._id || e.id) === examId
      );
      if (!found) {
        setError("Exam not found in this lesson.");
      }
      setExam(found || null);
    } catch (e) {
      console.error(e);
      setError("Failed to load exam");
    } finally {
      setLoading(false);
    }
  }, [examId, lessonId, passedExam]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  const questions = useMemo(() => exam?.questions ?? [], [exam]);

  const handleAnswer = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!exam) return;

    const payload = {
      answers: questions.map((q, index) => ({
        questionId: q._id || q.id,
        answer: answers[index] ?? "",
      })),
    };
    setSubmitting(true);
    setError("");
    try {
      await sibmitExam(lessonId, examId, payload);
      navigate(`/exams/${examId}/result`, { state: { examId, lessonId } });
    } catch (e) {
      console.error(e);
      setError("Failed to submit exam");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading exam...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen mt-20 p-4 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </section>
    );
  }

  if (!exam) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Exam not available.</p>
      </section>
    );
  }

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {exam.title || "Exam"}
          </h1>
          <div className="text-gray-600 mt-2 flex gap-4 text-sm">
            <span>Subject: {exam.subject || "General"}</span>
            <span>Duration: {exam.duration || 60} min</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-gray-600">No questions available.</p>
          ) : (
            questions.map((q, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow border border-gray-100 p-4"
              >
                <div className="font-medium text-gray-900 mb-3">
                  Q{index + 1}. {q.questionText}
                </div>

                {q.type === "mcq" ? (
                  <div className="space-y-2">
                    {(q.options || []).map((opt, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q-${index}`}
                          value={opt}
                          checked={answers[index] === opt}
                          onChange={(e) => handleAnswer(index, e.target.value)}
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { value: "true", label: "True" },
                      { value: "false", label: "False" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name={`q-${index}`}
                          value={opt.value}
                          checked={answers[index] === opt.value}
                          onChange={(e) => handleAnswer(index, e.target.value)}
                        />
                        <span className="text-gray-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserExam;
