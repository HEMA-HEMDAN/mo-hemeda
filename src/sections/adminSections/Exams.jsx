import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getLessonById,
  updateExam,
  createNewExam,
  deleteExam,
} from "../../services/lessons";

const Exams = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    date: "",
    duration: 60,
    questions: [],
  });
  const loadLessonAndExams = useCallback(async () => {
    if (!lessonId) return;

    setLoading(true);
    setError("");
    try {
      const lessonData = await getLessonById(lessonId);
      setLesson(lessonData);
      setExams(lessonData.exams || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load lesson and exams");
      toast.error("Failed to load lesson and exams");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadLessonAndExams();
  }, [loadLessonAndExams]);

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      date: "",
      duration: 60,
      questions: [],
    });
    setEditingExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const examData = {
        ...form,
        date: new Date(form.date).toISOString(),
      };

      if (editingExam) {
        // Use the updateExam API with lessonId and examId
        await updateExam(lessonId, editingExam._id, examData);
        toast.success("Exam updated successfully");
      } else {
        // Add new exam using API
        await createNewExam(lessonId, examData);
        toast.success("Exam added successfully");
      }

      await loadLessonAndExams();
      setModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (exam) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await deleteExam(lessonId, exam._id || exam.id);
      toast.success("Exam deleted");
      await loadLessonAndExams();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setForm({
      title: exam.title || "",
      subject: exam.subject || "",
      date: exam.date ? new Date(exam.date).toISOString().split("T")[0] : "",
      duration: exam.duration || 60,
      questions: exam.questions || [],
    });
    setModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setModalOpen(true);
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          type: "mcq",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate("/admin/academic-years")}
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
              >
                ← Academic Years
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() =>
                  navigate(`/admin/lessons/${lesson?.academicYearId?._id}`)
                }
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                ← Back to Lessons
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Exams Management
            </h1>
            {lesson && (
              <p className="text-gray-600 mt-2">
                Managing exams for:{" "}
                <span className="font-semibold">{lesson.title}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            ➕ Add New Exam
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-600 text-lg font-medium">
                Loading exams...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Exams Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No exams found
                </h3>
                <p className="text-gray-500">
                  Start by adding your first exam!
                </p>
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam._id || exam.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {exam.title || "Untitled Exam"}
                      </h3>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(exam)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit exam"
                        >
                          🖊️
                        </button>
                        <button
                          onClick={() => handleDelete(exam)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete exam"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Subject:</span>
                        <span>{exam.subject || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Date:</span>
                        <span>
                          {exam.date
                            ? new Date(exam.date).toLocaleDateString()
                            : "Not scheduled"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Duration:</span>
                        <span>{exam.duration || 60} minutes</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>❓ {exam.questions?.length || 0} questions</span>
                        <button
                          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                          onClick={() =>
                            navigate(`/admin/exams/results/${exam._id}`)
                          }
                        >
                          exam results
                        </button>
                      </div>
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
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingExam ? "✏️ Edit Exam" : "➕ Add New Exam"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter exam title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={form.duration}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Questions
                      </h3>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        ➕ Add Question
                      </button>
                    </div>

                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {form.questions.map((question, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              Question {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              🗑️ Remove
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Question Text *
                              </label>
                              <input
                                type="text"
                                required
                                value={question.questionText}
                                onChange={(e) =>
                                  updateQuestion(
                                    index,
                                    "questionText",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter question text"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Type *
                              </label>
                              <select
                                value={question.type}
                                onChange={(e) =>
                                  updateQuestion(index, "type", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="mcq">Multiple Choice</option>
                                <option value="true_false">True/False</option>
                              </select>
                            </div>

                            {question.type === "mcq" && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  Options *
                                </label>
                                {question.options.map((option, optionIndex) => (
                                  <input
                                    key={optionIndex}
                                    type="text"
                                    required
                                    value={option}
                                    onChange={(e) =>
                                      updateQuestionOption(
                                        index,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                ))}
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Correct Answer *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={question.correctAnswer}
                                    onChange={(e) =>
                                      updateQuestion(
                                        index,
                                        "correctAnswer",
                                        e.target.value
                                      )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter correct answer"
                                  />
                                </div>
                              </div>
                            )}

                            {question.type === "true_false" && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  Correct Answer *
                                </label>
                                <select
                                  value={question.correctAnswer}
                                  onChange={(e) =>
                                    updateQuestion(
                                      index,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                >
                                  <option value="">Select answer</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {form.questions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>
                            No questions added yet. Click "Add Question" to get
                            started.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      {editingExam ? "💾 Update" : "✨ Create"}
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

export default Exams;
