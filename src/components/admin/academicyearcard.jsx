import React, { useEffect, useRef, useState } from "react";
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  postAcademicYearImage,
} from "../../services/academic-years";
import { MdDelete } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

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
  const [selectedFile, setSelectedFile] = useState(null);

  const resetForm = () => {
    setForm({ title: "", telegramChannel: "", image: "" });
    setSelectedFile(null);
    setEditing(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;

      // If a file is selected, upload it first
      if (selectedFile) {
        const imageResponse = await postAcademicYearImage(selectedFile);
        console.log("Image upload response:", imageResponse);
        imageUrl = imageResponse?.data?.url || imageResponse?.data?.display_url;
      }

      const formData = {
        ...form,
        image: imageUrl,
      };

      if (editing) {
        await updateAcademicYear(editing._id || editing.id, formData);
      } else {
        await createAcademicYear(formData);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Clear the image URL when a new file is selected
    setForm((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center gap-20 my-5 md:my-10">
        <h1 className="text-3xl md:text-5xl text-[#c5f10f] text-center font-bold">
          Academic Years
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            className="w-full sm:w-auto bg-[#121821] text-[#c5f10f] border border-[#c5f10f]/30 px-4 py-2 rounded-lg hover:bg-[#121821]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={load}
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <LuRefreshCw className="w-4 h-4 inline mr-1" />
                Refresh
              </>
            )}
          </button>
          <button
            className="w-full sm:w-auto bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-6 py-2 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            onClick={() => {
              setFormOpen(true);
              resetForm();
            }}
          >
            <IoMdAdd className="w-6 h-6 inline mr-1" /> Add New Year
          </button>
        </div>
      </div>

      {formOpen && (
        <div className="mb-8">
          <div className="bg-[#1b232e]/95 backdrop-blur border border-[#c5f10f]/20 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editing ? (
                <>
                  <MdEdit className="w-4 h-4 inline mr-1" />
                  Edit Academic Year
                </>
              ) : (
                <>
                  <MdEdit className="w-4 h-4 inline mr-1" />
                  Add New Academic Year
                </>
              )}
            </h3>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Title *
                  </label>
                  <input
                    placeholder="Enter academic year title"
                    className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200"
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Telegram Channel
                  </label>
                  <input
                    placeholder="Enter telegram channel URL"
                    className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200"
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
                  <label className="block text-sm font-medium text-gray-300">
                    Image File
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="w-full border border-[#c5f10f]/30 bg-[#121821] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c5f10f] focus:border-[#c5f10f] transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c5f10f] file:text-[#1b232e] hover:file:bg-[#a8d708]"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-400 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#c5f10f]/20">
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
                  className="w-full sm:w-auto bg-gradient-to-r from-[#c5f10f] to-[#a8d708] text-[#1b232e] px-8 py-3 rounded-lg hover:from-[#a8d708] hover:to-[#c5f10f] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c5f10f]"></div>
            <p className="text-gray-300 text-lg font-medium">
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
        <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10 mx-5 md:mx-10">
          {academicYears.map((u) => {
            const uid = u._id || u.id; // fallback
            const createdAt = u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Unknown date";

            return (
              <div
                key={uid}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className="flex flex-col mb-10 cursor-pointer"
                  onClick={() => onSelectYear && onSelectYear(u)}
                >
                  <div className="group rounded-xl overflow-hidden w-[300px] lg:w-[400px] md:w-[550px] h-[200px] lg:h-[250px] md:h-[300px]">
                    {u.image ? (
                      <img
                        src={u.image}
                        alt={u.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 duration-500 ease-in-out grayscale-30 hover:grayscale-0"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📚</div>
                          <p className="text-sm font-medium">No Image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center px-4 mx-2 md:px-8 py-4 rounded-md -mt-10 bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-200 z-10 hover:scale-105 duration-500">
                    <h1 className="text-center text-lg md:text-4xl lg:text-3xl">
                      {u.title || "Untitled"}
                    </h1>
                    <div className="w-full h-1 bg-[#c5f10f] my-2"></div>
                    <h1 className="text-center text-sm md:text-xl lg:text-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                      {u.telegramChannel
                        ? "📱 Telegram Available"
                        : "📚 Academic Year"}
                    </h1>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-[#c5f10f] text-[#1b232e] text-xs font-semibold hover:bg-[#a8d708] transition-all duration-200 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(u);
                          setFormOpen(true);
                          setForm({
                            title: u.title || "",
                            telegramChannel: u.telegramChannel || "",
                            image: u.image || "",
                          });
                          setSelectedFile(null);
                          if (fileRef.current) {
                            fileRef.current.value = "";
                          }
                        }}
                      >
                        <>
                          <MdEdit className="w-4 h-4 inline mr-1" />
                          Edit
                        </>
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(u);
                        }}
                      >
                        <>
                          <MdDelete className="w-4 h-4 inline mr-1" />
                          Delete
                        </>
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
