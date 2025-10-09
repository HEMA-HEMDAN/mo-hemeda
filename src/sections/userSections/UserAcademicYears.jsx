import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonsByYearId } from "../../services/lessons";
import Loading from "../../components/rusable/Loading";

const UserAcademicYears = () => {
  const { yearId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Academic Years";
  }, []);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const loadLessons = useCallback(async () => {
    if (!yearId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getLessonsByYearId(yearId);
      setLessons(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [yearId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return (
    <>
      <Loading />
      <section className="min-h-screen p-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            
            <h1 className="text-3xl font-bold text-[#1b232e] dark:text-white  ">
              Lessons
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Available lessons for this academic year
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c5f10f]"></div>
              <p className="text-gray-300 text-lg font-medium">
                Loading lessons...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No lessons found
                </h3>
                <p className="text-gray-400">Please check back later.</p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <div
                  key={lesson._id || lesson.id}
                  className="bg-gray-900 backdrop-blur rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#c5f10f]/20 overflow-hidden flex flex-col"
                >
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {lesson.title || "Untitled Lesson"}
                    </h3>
                    <p className="text-gray-300 text-sm mt-2 mb-6 line-clamp-3">
                      {lesson.description || "No description provided"}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() =>
                          navigate(`/lessons/${lesson._id || lesson.id}`)
                        }
                        className="w-full bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-4 py-2 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 text-sm font-medium shadow"
                      >
                        Open Lesson
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default UserAcademicYears;
