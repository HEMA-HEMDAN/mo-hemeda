import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonById } from "../../services/lessons";
import Loading from "../../components/rusable/Loading";

const UserLessons = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    document.title = "Lessons";
  }, []);
  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getLessonById(lessonId);
      setLesson(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const getEmbedUrl = useCallback((url) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      }
      if (url.includes("/embed/")) return url;
    } catch {
      return url;
    }
    return url;
  }, []);

  const exams = useMemo(() => lesson?.exams ?? [], [lesson]);

  const isExamLocked = (exam) => {
    if (!exam?.date) return false;
    try {
      return new Date(exam.date) > new Date();
    } catch {
      return false;
    }
  };

  const isExamEnded = (exam) => {
    if (!exam?.date) return false;
    const durationMinutes = Number(exam.duration || 0);
    try {
      const start = new Date(exam.date);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
      return new Date() > end;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading lesson...</p>
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

  if (!lesson) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-300 text-lg">No lesson found.</p>
      </section>
    );
  }

  return (
    <>
      <Loading />
    <div className="min-h-screen mt-20 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1b232e] dark:text-white">
            {lesson.title || "Lesson"}
          </h1>
          {lesson.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{lesson.description}</p>
          )}
        </div>

        {lesson.youtubeLink && (
          <div className="mb-8 rounded-lg overflow-hidden border border-[#c5f10f]/20">
            <iframe
              width="100%"
              height="360"
              src={getEmbedUrl(lesson.youtubeLink)}
              title={lesson.title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[360px]"
            ></iframe>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b232e] dark:text-white mb-4">Exams</h2>
          {exams.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No exams available for this lesson.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => {
                const locked = isExamLocked(exam);
                const ended = isExamEnded(exam);
                const startAt = exam?.date
                  ? new Date(exam.date).toLocaleString()
                  : "Not scheduled";
                return (
                  <div
                    key={exam._id || exam.id}
                    className="bg-[#1b232e]/80 backdrop-blur rounded-xl shadow border border-[#c5f10f]/20 p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {exam.title || "Exam"}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {exam.subject || "General"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div>
                        <span className="font-medium">Starts:</span> {startAt}
                      </div>
                      {exam.description && (
                        <div className="mt-1 line-clamp-3">
                          {exam.description}
                        </div>
                      )}
                    </div>

                    <div className="pt-3">
                      {locked ? (
                        <button
                          disabled
                          className="w-full cursor-not-allowed bg-white/10 text-gray-400 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                          title="Exam is locked until start time"
                        >
                          🔒 Locked
                        </button>
                      ) : ended ? (
                        <button
                          className="w-full bg-[#121821] text-[#c5f10f] border border-[#c5f10f]/30 px-4 py-2 rounded-lg hover:bg-[#121821]/80 transition-all duration-200 font-medium"
                          onClick={() =>
                            navigate(`/exams/${exam._id || exam.id}/result`, {
                              state: { lessonId: lesson._id || lesson.id },
                            })
                          }
                        >
                          View Result
                        </button>
                      ) : (
                        <button
                          className="w-full bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-4 py-2 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 font-medium"
                          onClick={() =>
                            navigate(`/exams/${exam._id || exam.id}`, {
                              state: {
                                exam,
                                lessonId: lesson._id || lesson.id,
                              },
                            })
                          }
                        >
                          Start Exam
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default UserLessons;
