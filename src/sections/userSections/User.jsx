import React, { useEffect, useState } from "react";
import { getUserResults } from "../../services/rusult";

const User = () => {
  // this one is hell of work you need to do almost the same as the result file so good luck
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        // Backend derives user from token
        const res = await getUserResults();
        console.log(res);
        setResults(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load your results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedResult(null);
  };

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your results...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </section>
    );
  }

  return (
    <div className="min-h-screen mt-20 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          My Results
        </h1>

        {results.length === 0 ? (
          <p className="text-gray-600">You have no results yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r) => (
              <div
                key={r._id || `${r.examId}-${r.userId}`}
                className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">
                    {r.exam?.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: <span className="font-semibold">{r.score ?? 0}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{r.exam?.subject}</div>
                <div className="pt-2">
                  <button
                    onClick={() => handleViewDetails(r)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup for exam details */}
      {showPopup && selectedResult && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedResult.exam?.title}
                  </h2>
                  <div className="text-blue-100 mt-2 flex gap-4 text-sm">
                    <span>Subject: {selectedResult.exam?.subject}</span>
                    <span>
                      Score:{" "}
                      <span className="font-semibold">
                        {selectedResult.score ?? 0}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={closePopup}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedResult.exam?.questions &&
              selectedResult.exam.questions.length > 0 ? (
                <div className="space-y-6">
                  {selectedResult.exam.questions.map((question, index) => {
                    // Find user's answer for this question
                    const userAnswer =
                      selectedResult.answers?.find(
                        (ans) =>
                          ans.questionId === (question._id || question.id)
                      )?.answer || "";

                    const isCorrect =
                      String(userAnswer).toLowerCase() ===
                      String(question.correctAnswer).toLowerCase();

                    return (
                      <div
                        key={question._id || question.id || index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="font-medium text-gray-900 mb-3">
                          Q{index + 1}. {question.questionText}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              Your answer:
                            </span>
                            <span
                              className={`font-semibold ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {userAnswer || "No answer provided"}
                            </span>
                          </div>

                          {question.correctAnswer !== undefined &&
                            question.correctAnswer !== null && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">
                                  Correct answer:
                                </span>
                                <span className="font-semibold text-green-600">
                                  {String(question.correctAnswer)}
                                </span>
                              </div>
                            )}

                          <div
                            className={`font-semibold ${
                              isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No questions available for this exam.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closePopup}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
