// src/components/ExamComponent.js

import React, { useState, useEffect, useCallback } from "react";

const ExamComponent = ({ questionsData }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (examStarted && !examCompleted) {
      interval = setInterval(() => {
        setTimeSpent((timeSpent) => timeSpent + 1);
      }, 1000);
    } else if (!examStarted || examCompleted) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [examStarted, examCompleted]);

  // Calculate progress
  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = questionsData.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Handle option selection with better state management
  const handleOptionChange = useCallback((questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  // Navigation functions
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

  // Start exam
  const startExam = () => {
    setExamStarted(true);
    setTimeSpent(0);
  };

  // Submit exam with validation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredQuestions < totalQuestions) {
      const unansweredQuestions = totalQuestions - answeredQuestions;
      if (
        !confirm(
          `لديك ${unansweredQuestions} أسئلة لم تجب عليها. هل تريد المتابعة؟`
        )
      ) {
        return;
      }
    }

    setSubmitted(true);
    setExamCompleted(true);

    let calculatedScore = 0;
    const results = questionsData.map((question) => {
      const correctAnswer = question.options.find((opt) => opt.isCorrect);
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === correctAnswer?.id;

      if (isCorrect) {
        calculatedScore += 1;
      }

      return {
        questionId: question.id,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: correctAnswer?.id,
        isCorrect,
        correctAnswerText: correctAnswer?.text,
      };
    });

    setScore(calculatedScore);
    setShowResults(true);
  };

  // Reset exam
  const resetExam = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(1);
    setTimeSpent(0);
    setShowResults(false);
    setExamStarted(false);
    setExamCompleted(false);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get current question
  const currentQuestionData = questionsData.find(
    (q) => q.id === currentQuestion
  );

  {
    !examStarted && startExam();
  }
  if (showResults) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const grade =
      percentage >= 90
        ? "ممتاز"
        : percentage >= 80
        ? "جيد جداً"
        : percentage >= 70
        ? "جيد"
        : percentage >= 60
        ? "مقبول"
        : "ضعيف";

    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  percentage >= 70 ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                نتائج الامتحان
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                مراجعة شاملة للإجابات
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  من {totalQuestions}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  النسبة المئوية
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  الوقت المستغرق
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {grade}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  التقدير
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetExam}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>

          {/* Detailed Exam Review */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6">
              مراجعة تفصيلية للامتحان
            </h2>

            {questionsData.map((question) => {
              const userAnswer = userAnswers[question.id];
              const correctAnswer = question.options.find(
                (opt) => opt.isCorrect
              );
              const userAnswerText = question.options.find(
                (opt) => opt.id === userAnswer
              )?.text;
              const isCorrect = userAnswer === correctAnswer?.id;

              return (
                <div
                  key={question.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      السؤال {question.id}
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {isCorrect ? "✓ صحيح" : "✗ خطأ"}
                    </div>
                  </div>

                  {/* Question Image */}
                  {question.image && (
                    <div className="mb-4 text-center">
                      <img
                        src={question.image}
                        alt={`السؤال ${question.id}`}
                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                      />
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="mb-6">
                    <p className="text-lg text-gray-800 dark:text-gray-200 text-right">
                      {question.questionText}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      let optionClass =
                        "p-4 rounded-lg border-2 text-right font-medium ";

                      if (option.isCorrect) {
                        optionClass +=
                          "bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200";
                      } else if (option.id === userAnswer) {
                        optionClass +=
                          "bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200";
                      } else {
                        optionClass +=
                          "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300";
                      }

                      return (
                        <div key={option.id} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            <div className="flex items-center gap-2">
                              {option.isCorrect && (
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                  الإجابة الصحيحة
                                </span>
                              )}
                              {option.id === userAnswer &&
                                !option.isCorrect && (
                                  <span className="text-red-600 dark:text-red-400 font-bold">
                                    إجابتك
                                  </span>
                                )}
                              {option.id === userAnswer && option.isCorrect && (
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                  إجابتك الصحيحة
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              امتحان الرياضيات
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              الوقت: {formatTime(timeSpent)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                التقدم: {answeredQuestions} من {totalQuestions}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2">
            {questionsData.map((_, index) => (
              <button
                key={index + 1}
                onClick={() => goToQuestion(index + 1)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentQuestion === index + 1
                    ? "bg-indigo-600 text-white"
                    : userAnswers[index + 1]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          {currentQuestionData && (
            <>
              {currentQuestionData.image && (
                <div className="mb-6 text-center">
                  <img
                    src={currentQuestionData.image}
                    alt={`السؤال ${currentQuestionData.id}`}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  />
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-right">
                السؤال {currentQuestionData.id}:{" "}
                {currentQuestionData.questionText}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option) => (
                  <label key={option.id} className="block cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestionData.id}`}
                      value={option.id}
                      checked={
                        userAnswers[currentQuestionData.id] === option.id
                      }
                      onChange={() =>
                        handleOptionChange(currentQuestionData.id, option.id)
                      }
                      className="hidden"
                    />
                    <div
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ease-in-out text-right ${
                        userAnswers[currentQuestionData.id] === option.id
                          ? "bg-indigo-500 border-indigo-500 text-white"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:border-indigo-300"
                      }`}
                    >
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentQuestion === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            السابق
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestion} من {totalQuestions}
          </div>

          {currentQuestion === totalQuestions ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              إنهاء الامتحان
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamComponent;
