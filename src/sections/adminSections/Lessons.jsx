import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLessonsByYearId,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../services/lessons";

const Lessons = () => {
  const { academicYearId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
  });

  const loadLessons = useCallback(async () => {
    if (!academicYearId) return;

    setLoading(true);
    setError("");
    try {
      const data = await getLessonsByYearId(academicYearId);
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load lessons");
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [academicYearId]);

  useEffect(() => {
    loadLessons();
  }, [academicYearId, loadLessons]);

  const resetForm = () => {
    setForm({ title: "", description: "", youtubeLink: "" });
    setEditingLesson(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const lessonData = {
        ...form,
        academicYearId,
        exams: [], // Initialize with empty exams array
      };

      if (editingLesson) {
        await updateLesson(editingLesson._id || editingLesson.id, lessonData);
        toast.success("Lesson updated successfully");
      } else {
        await createLesson(lessonData);
        toast.success("Lesson added successfully");
      }

      await loadLessons();
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (lesson) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(lesson._id || lesson.id);
      toast.success("Lesson deleted");
      await loadLessons();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title || "",
      description: lesson.description || "",
      youtubeLink: lesson.youtubeLink || "",
    });
    setModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };
  // Converts normal or short YouTube URLs into embeddable URLs
  const getEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      // handle youtu.be links
      if (parsed.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      }
      // already embed
      if (url.includes("/embed/")) return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen mt-8 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate("/admin/academic-years")}
              className="text-[#c5f10f] hover:text-white font-medium mb-2 flex items-center gap-2 transition-colors duration-300"
            >
              ← Back to Academic Years
            </button>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-[#c5f10f] to-white bg-clip-text text-transparent">
              Lessons Management
            </h1>
            <p className="text-gray-300 mt-2">
              Manage lessons for this academic year
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-6 py-3 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            ➕ Add New Lesson
          </button>
        </div>

        {/* Loading State */}
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

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Lessons Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No lessons found
                </h3>
                <p className="text-gray-400">
                  Start by adding your first lesson!
                </p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <div
                  key={lesson._id || lesson.id}
                  className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-[#c5f10f]/40"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {lesson.title || "Untitled Lesson"}
                      </h3>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(lesson)}
                          className="p-2 text-[#c5f10f] hover:bg-[#c5f10f]/20 rounded-lg transition-colors"
                          title="Edit lesson"
                        >
                          🖊️
                        </button>
                        <button
                          onClick={() => handleDelete(lesson)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete lesson"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {lesson.description || "No description provided"}
                    </p>

                    {lesson.youtubeLink && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-[#c5f10f]/20">
                        <iframe
                          width="100%"
                          height="200"
                          src={getEmbedUrl(lesson.youtubeLink)}
                          title={lesson.title || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-52"
                        ></iframe>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[#c5f10f]/20">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <span>📝 {lesson.exams?.length || 0} exams</span>
                        <span>
                          {lesson.createdAt
                            ? new Date(lesson.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/admin/exams/${lesson._id || lesson.id}`)
                        }
                        className="w-full bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-4 py-2 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        📝 Manage Exams
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1b232e]/95 backdrop-blur border border-[#c5f10f]/20 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {editingLesson ? "✏️ Edit Lesson" : "➕ Add New Lesson"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200"
                      placeholder="Enter lesson title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200"
                      placeholder="Enter lesson description"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube Link
                    </label>
                    <input
                      type="url"
                      value={form.youtubeLink}
                      onChange={(e) =>
                        setForm({ ...form, youtubeLink: e.target.value })
                      }
                      className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-4 py-3 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 font-medium shadow-lg"
                    >
                      {editingLesson ? "💾 Update" : "✨ Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
