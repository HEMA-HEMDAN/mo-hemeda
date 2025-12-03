import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { sibmitExam } from "../../services/rusult";
import { getLessonById } from "../../services/lessons";

/**
 * This component renders the exam experience using the modern ExamComponent-like UI
 * but uses the APIs, exam fetching, and submission logic from the original UserExam.jsx.
 */
const UserExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedExam = location?.state?.exam || null;
  const lessonId = location?.state?.lessonId || null;

  const [exam, setExam] = useState(passedExam);
  const [loading, setLoading] = useState(!passedExam);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // For ExamComponent-like experience
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examDuration, setExamDuration] = useState(60 * 60); // Default 60 minutes in seconds
  const [timeWarningShown, setTimeWarningShown] = useState(false);
  const [examLocked, setExamLocked] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);

  useEffect(() => {
    document.title = "Exam";

    // Check if exam is locked (already submitted)
    const examLockStatus = localStorage.getItem(`exam_locked_${examId}`);
    if (examLockStatus) {
      setExamLocked(true);
      return;
    }

    // Load exam timer data from localStorage
    const savedTimerData = localStorage.getItem(`exam_timer_${examId}`);
    if (savedTimerData) {
      const { startTime, duration } = JSON.parse(savedTimerData);
      setExamStartTime(startTime);
      setExamDuration(duration);

      // Calculate time spent and remaining
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);

      setTimeSpent(elapsed);
      setTimeRemaining(remaining);

      // If time is up, auto-submit
      if (remaining <= 0) {
        handleSubmit();
      }
    } else {
      // Start new exam timer
      const startTime = Date.now();
      setExamStartTime(startTime);
      setTimeRemaining(examDuration);

      // Save to localStorage
      localStorage.setItem(
        `exam_timer_${examId}`,
        JSON.stringify({
          startTime,
          duration: examDuration,
        })
      );
    }

    // Cleanup function to remove timer when component unmounts
    return () => {
      // Cleanup function - timer will be removed when exam is submitted
    };
  }, [examId]);

  const fetchExam = useCallback(async () => {
    if (passedExam) return;
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
      setError("Failed to load exam");
    } finally {
      setLoading(false);
    }
  }, [examId, lessonId, passedExam]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  // Timer effect (ExamComponent style)
  useEffect(() => {
    let interval = null;
    if (exam && examStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - examStartTime) / 1000);
        const remaining = Math.max(0, examDuration - elapsed);

        setTimeSpent(elapsed);
        setTimeRemaining(remaining);

        // Update localStorage
        localStorage.setItem(
          `exam_timer_${examId}`,
          JSON.stringify({
            startTime: examStartTime,
            duration: examDuration,
          })
        );

        // Show warning when 5 minutes left
        if (remaining <= 300 && !timeWarningShown) {
          alert("تحذير: متبقي 5 دقائق فقط على انتهاء الامتحان!");
          setTimeWarningShown(true);
        }

        // Auto-submit when time is up
        if (remaining <= 0) {
          handleSubmit();
        }
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [exam, examStartTime, examDuration, examId]);

  const questions = useMemo(() => exam?.questions ?? [], [exam]);
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(userAnswers).length;
  const progressPercentage = totalQuestions
    ? (answeredQuestions / totalQuestions) * 100
    : 0;

  const handleOptionChange = useCallback((questionId, optionValue) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  }, []);

  const goToQuestion = (questionNumber) => {
    if (questionNumber >= 1 && questionNumber <= totalQuestions) {
      setCurrentQuestion(questionNumber);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // SUBMIT: Use UserExam api logic, but on this UI
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!exam) return;
    if (answeredQuestions < totalQuestions) {
      const unansweredQuestions = totalQuestions - answeredQuestions;
      if (
        !window.confirm(
          `You have ${unansweredQuestions} unanswered questions. Submit anyway?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q._id || q.id,
          answer: userAnswers[q._id || q.id] ?? "",
        })),
      };
      await sibmitExam(lessonId, examId, payload);

      // Calculate score for local display (if possible) for MCQ and true/false
      let calculatedScore = 0;
      questions.forEach((q) => {
        const userAns = userAnswers[q._id || q.id];
        if (q.type === "mcq" && q.answer) {
          if (userAns === q.answer) calculatedScore++;
        }
        if (
          q.type === "boolean" &&
          (q.answer === "true" || q.answer === "false")
        ) {
          if (userAns === q.answer) calculatedScore++;
        }
        // Otherwise, skip auto-grade
      });
      // Navigate to result page instead of showing results inline
      navigate(`/`);
      // Lock the exam after submission
      localStorage.setItem(
        `exam_locked_${examId}`,
        JSON.stringify({
          submittedAt: new Date().toISOString(),
          score: calculatedScore,
          totalQuestions: totalQuestions,
        })
      );

      // Clear timer from localStorage when exam is submitted
      localStorage.removeItem(`exam_timer_${examId}`);

      // Optionally, navigate to a result page:
      // navigate(`/exams/${examId}/result`, { state: { examId, lessonId } });
    } catch (e) {
      setError("Failed to submit exam");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl">
          <p className="text-[#c5f10f] text-lg font-medium">Loading exam...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen mt-20 p-4 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-red-500/30 p-8 rounded-xl">
          <p className="text-red-400 text-lg font-medium">{error}</p>
        </div>
        <button
          className="bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] text-[#0f141b] px-6 py-3 rounded-lg hover:from-[#a8d90a] hover:to-[#c5f10f] transition-all duration-200 font-medium"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </section>
    );
  }

  if (!exam) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl">
          <p className="text-white text-lg font-medium">Exam not available.</p>
        </div>
      </section>
    );
  }

  // Check if exam is locked (already submitted)
  if (examLocked) {
    const lockData = localStorage.getItem(`exam_locked_${examId}`);
    const lockInfo = lockData ? JSON.parse(lockData) : null;

    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center ">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] bg-clip-text text-transparent mb-4">
            تم إرسال الامتحان
          </h2>
          <p className="text-white/80 mb-4">
            لقد قمت بإرسال هذا الامتحان مسبقاً ولا يمكن إعادة المحاولة.
          </p>
          {lockInfo && (
            <div className="bg-[#121821] border border-[#c5f10f]/30 p-4 rounded-lg mb-4">
              
              <div className="text-xs text-white/60 mt-1">
                تم الإرسال في:{" "}
                {new Date(lockInfo.submittedAt).toLocaleDateString("ar-SA")}
              </div>
            </div>
          )}
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] text-[#0f141b] px-6 py-3 rounded-lg hover:from-[#a8d90a] hover:to-[#c5f10f] transition-all duration-200 font-medium"
          >
            العودة للدروس
          </button>
        </div>
      </section>
    );
  }

  // Main Exam UI (ExamComponent style)
  const currentQuestionData = questions[currentQuestion - 1];
  return (
    <div className="min-h-screen p-4 font-sans mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#1b232e] backdrop-blur border border-[#c5f10f]/20 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] bg-clip-text text-transparent">
              {exam.title || "Exam"}
            </h1>
            <div className="flex flex-col items-end">
              <div
                className={`text-sm font-medium ${
                  timeRemaining <= 300 ? "text-red-400" : "text-[#c5f10f]"
                }`}
              >
                الوقت المتبقي: {formatTimeRemaining(timeRemaining)}
              </div>
              {timeRemaining <= 300 && (
                <div className="text-xs text-red-400 animate-pulse">
                  ⚠️ وقت قليل متبقي!
                </div>
              )}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>
                التقدم: {answeredQuestions} من {totalQuestions}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-[#121821] rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q._id || q.id || index + 1}
                onClick={() => goToQuestion(index + 1)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentQuestion === index + 1
                    ? "bg-[#c5f10f] text-[#0f141b]"
                    : userAnswers[q._id || q.id]
                    ? "bg-green-500 text-white"
                    : "bg-[#121821] text-white hover:bg-[#1b232e] border border-[#c5f10f]/30"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Current Question */}
        <div className="bg-[#1b232e] backdrop-blur border border-[#c5f10f]/20 p-6 rounded-xl shadow-lg mb-6">
          {currentQuestionData && (
            <>
              {currentQuestionData.questionImgUrl && (
                <div className="mb-6 text-center">
                  <img
                    src={currentQuestionData.questionImgUrl}
                    alt={`السؤال ${currentQuestion}`}
                    className="max-h-[400px] rounded-lg shadow-md mx-auto"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold text-white mb-6 text-right">
                {currentQuestionData.questionText} : السؤال {currentQuestion}
              </h2>
              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Debug info */}
                <div className="col-span-2 text-xs text-[#c5f10f]/70 mb-2">
                  Question Type: {currentQuestionData.type} 
                  
                </div>
                {currentQuestionData.type === "mcq" &&
                  (currentQuestionData.options || []).map((option, idx) => {
                    const optVal =
                      typeof option === "string"
                        ? option
                        : option.value || option.text || option;
                    const optText =
                      typeof option === "string"
                        ? option
                        : option.text || option.value || option;
                    return (
                      <label key={optVal} className="block cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${
                            currentQuestionData._id || currentQuestionData.id
                          }`}
                          value={optVal}
                          checked={
                            userAnswers[
                              currentQuestionData._id || currentQuestionData.id
                            ] === optVal
                          }
                          onChange={() =>
                            handleOptionChange(
                              currentQuestionData._id || currentQuestionData.id,
                              optVal
                            )
                          }
                          className="hidden"
                        />
                        <div
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ease-in-out text-right ${
                            userAnswers[
                              currentQuestionData._id || currentQuestionData.id
                            ] === optVal
                              ? "bg-[#c5f10f] border-[#c5f10f] text-[#0f141b]"
                              : "bg-[#121821] border-[#c5f10f]/30 text-white hover:bg-[#1b232e] hover:border-[#c5f10f]/50"
                          }`}
                        >
                          <span className="font-medium">{optText}</span>
                        </div>
                      </label>
                    );
                  })}
                {(currentQuestionData.type === "boolean" ||
                  currentQuestionData.type === "truefalse" ||
                  currentQuestionData.type === "true_false") &&
                  ["true", "false"].map((boolVal) => (
                    <label key={boolVal} className="block cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${
                          currentQuestionData._id || currentQuestionData.id
                        }`}
                        value={boolVal}
                        checked={
                          userAnswers[
                            currentQuestionData._id || currentQuestionData.id
                          ] === boolVal
                        }
                        onChange={() =>
                          handleOptionChange(
                            currentQuestionData._id || currentQuestionData.id,
                            boolVal
                          )
                        }
                        className="hidden"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ease-in-out text-right ${
                          userAnswers[
                            currentQuestionData._id || currentQuestionData.id
                          ] === boolVal
                            ? "bg-[#c5f10f] border-[#c5f10f] text-[#0f141b]"
                            : "bg-[#121821] border-[#c5f10f]/30 text-white hover:bg-[#1b232e] hover:border-[#c5f10f]/50"
                        }`}
                      >
                        <span className="font-medium">
                          {boolVal === "true" ? "True" : "False"}
                        </span>
                      </div>
                    </label>
                  ))}
                {/* Fallback for unrecognized question types */}
                {currentQuestionData.type !== "mcq" &&
                  currentQuestionData.type !== "boolean" &&
                  currentQuestionData.type !== "truefalse" &&
                  currentQuestionData.type !== "true_false" && (
                    <div className="col-span-2 p-4 bg-[#1b232e] border border-[#c5f10f]/30 rounded-lg">
                      <p className="text-[#c5f10f]">
                        Unrecognized question type: "{currentQuestionData.type}
                        ". Please contact support.
                      </p>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-[#1b232e] backdrop-blur border border-[#c5f10f]/20 p-4 rounded-xl shadow-lg">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentQuestion === 1
                ? "bg-[#121821] text-[#c5f10f]/50 cursor-not-allowed border border-[#c5f10f]/20"
                : "bg-[#121821] text-white hover:bg-[#1b232e] border border-[#c5f10f]/30 hover:border-[#c5f10f]/50"
            }`}
          >
            السابق
          </button>
          <div className="text-sm text-[#c5f10f] font-medium">
            {currentQuestion} of {totalQuestions}
          </div>
          {currentQuestion === totalQuestions ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] text-[#0f141b] font-medium rounded-lg hover:from-[#a8d90a] hover:to-[#c5f10f] focus:outline-none focus:ring-2 focus:ring-[#c5f10f] focus:ring-offset-2 transition-all duration-200"
            >
              {submitting ? "جاري الإرسال..." : "إنهاء الامتحان"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] text-[#0f141b] font-medium rounded-lg hover:from-[#a8d90a] hover:to-[#c5f10f] focus:outline-none focus:ring-2 focus:ring-[#c5f10f] focus:ring-offset-2 transition-all duration-200"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserExam;
