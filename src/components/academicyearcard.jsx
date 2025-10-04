import React, { useEffect, useRef, useState } from "react";
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} from "../services/academic-years";

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
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">Academic Years</h2>
        <div className="flex items-center gap-2">
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={load}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setFormOpen(true);
              resetForm();
            }}
          >
            + Add Year
          </button>
        </div>
      </div>

      {formOpen && (
        <form
          onSubmit={onSubmit}
          className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-lg border border-black/5 bg-white/90 p-4"
        >
          <input
            placeholder="Title"
            className="border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <input
            placeholder="Telegram Channel"
            className="border rounded px-3 py-2"
            value={form.telegramChannel}
            onChange={(e) =>
              setForm((p) => ({ ...p, telegramChannel: e.target.value }))
            }
          />
          <input
            ref={fileRef}
            value={form.image}
            placeholder="image link"
            className="border rounded px-3 py-2"
            onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded"
              onClick={() => {
                setFormOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p>Loading academic years...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && Array.isArray(academicYears) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicYears.map((u) => {
            const uid = u._id || u.id; // fallback
            const createdAt = u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Unknown date";

            return (
              <button
                key={uid}
                className="group relative aspect-square rounded-xl overflow-hidden border border-black/5 bg-white shadow-sm hover:shadow-md transition text-left"
                onClick={() => onSelectYear && onSelectYear(u)}
              >
                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {u.title || "Untitled"}
                      </h3>
                      <p className="text-xs text-white/80">
                        Created: {createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-white/90 text-gray-900 text-xs font-semibold hover:bg-white"
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
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(u);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {u.telegramChannel && (
                      <a
                        href={u.telegramChannel}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded bg-white/90 text-gray-900 text-xs font-semibold hover:bg-white"
                      >
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AcademicYearsTable;
