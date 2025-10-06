import React, { useEffect, useRef, useState } from "react";
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../../services/academic-years";

const AcademicYearsTable = ({ onSelectYear }) => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAcademicYears();
      setAcademicYears(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load academic years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No auth token; academic years table will not load");
      return;
    }
    load();
  }, []);

  const fileRef = useRef(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    telegramChannel: "",
    image: "",
  });

  const resetForm = () => {
    setForm({ title: "", telegramChannel: "", image: "" });
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAcademicYear(editing._id || editing.id, form);
      } else {
        await createAcademicYear(form);
      }
      await load();
      setFormOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save academic year");
    }
  };

  const onDelete = async (year) => {
    if (!confirm("Delete this academic year?")) return;
    try {
      await deleteAcademicYear(year._id || year.id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete academic year");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Academic Years
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
          <button
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            onClick={() => {
              setFormOpen(true);
              resetForm();
            }}
          >
            ➕ Add New Year
          </button>
        </div>
      </div>

      {formOpen && (
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {editing ? "✏️ Edit Academic Year" : "➕ Add New Academic Year"}
            </h3>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    placeholder="Enter academic year title"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Telegram Channel
                  </label>
                  <input
                    placeholder="Enter telegram channel URL"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                    value={form.telegramChannel}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        telegramChannel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    ref={fileRef}
                    value={form.image}
                    placeholder="Enter image URL"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, image: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {editing ? "💾 Update Year" : "✨ Create Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-white text-lg font-medium">
              Loading academic years...
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400 font-medium">⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && Array.isArray(academicYears) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {academicYears.map((u) => {
            const uid = u._id || u.id; // fallback
            const createdAt = u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Unknown date";

            return (
              <div
                key={uid}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => onSelectYear && onSelectYear(u)}
              >
                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-sm font-medium">No Image</p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold truncate mb-1">
                          {u.title || "Untitled"}
                        </h3>
                        <p className="text-xs text-white/70 flex items-center gap-1">
                          <span>📅</span>
                          Created: {createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {u.telegramChannel && (
                        <a
                          href={u.telegramChannel}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/30 transition-all duration-200 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📱 Telegram
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(u);
                          setFormOpen(true);
                          setForm({
                            title: u.title || "",
                            telegramChannel: u.telegramChannel || "",
                            image: u.image || "",
                          });
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500/80 backdrop-blur-sm text-white text-xs font-semibold hover:bg-red-600/80 transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(u);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AcademicYearsTable;
