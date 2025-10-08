import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLessonsByYearId } from "../../services/lessons";

const UserAcademicYears = () => {
  const { yearId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getEmbedUrl = (url) => {
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
  };

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
    <section className="min-h-screen p-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lessons
            </h1>
            <p className="text-gray-600 mt-2">
              Available lessons for this academic year
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-lg font-medium">
                Loading lessons...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No lessons found
                </h3>
                <p className="text-gray-500">Please check back later.</p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <div
                  key={lesson._id || lesson.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                >
                  {lesson.youtubeLink && (
                    <div className="aspect-video w-full bg-gray-100">
                      <iframe
                        title={lesson.title || "Lesson video"}
                        src={getEmbedUrl(lesson.youtubeLink)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {lesson.title || "Untitled Lesson"}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 mb-6 line-clamp-3">
                      {lesson.description || "No description provided"}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() =>
                          navigate(`/lessons/${lesson._id || lesson.id}`)
                        }
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium"
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
  );
};

export default UserAcademicYears;
