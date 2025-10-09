import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getResult } from "../../services/rusult";
import { getLessonById } from "../../services/lessons";
import Loading from "../../components/rusable/Loading";
const Result = () => {
  useEffect(() => {
    document.title = "Result";
  }, []);
  const { examId } = useParams();
  const location = useLocation();
  const lessonId = location?.state?.lessonId || null;

  const [result, setResult] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canViewResult, setCanViewResult] = useState(false);
  const [resultAvailableDate, setResultAvailableDate] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Backend extracts userId from token header
      const res = await getResult(lessonId, examId);
      setResult(res);

      if (lessonId) {
        const lesson = await getLessonById(lessonId);
        const found = (lesson?.exams || []).find(
          (e) => (e._id || e.id) === examId
        );
        setExam(found || null);
        
        // Check if result can be viewed based on exam settings
        if (found) {
          checkResultAvailability(found, res);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load result");
    } finally {
      setLoading(false);
    }
  }, [examId, lessonId]);
  
  const checkResultAvailability = (examData, resultData) => {
    const now = new Date();
    
    // Check if exam has result availability settings
    if (examData.resultAvailableDate) {
      const availableDate = new Date(examData.resultAvailableDate);
      setResultAvailableDate(availableDate);
      
      if (now >= availableDate) {
        setCanViewResult(true);
      } else {
        setCanViewResult(false);
      }
    } else if (examData.resultAvailableAfter) {
      // If result is available after a certain time from exam end
      const examEndTime = new Date(resultData?.submittedAt || resultData?.createdAt);
      const availableTime = new Date(examEndTime.getTime() + (examData.resultAvailableAfter * 60 * 1000)); // Convert minutes to milliseconds
      setResultAvailableDate(availableTime);
      
      if (now >= availableTime) {
        setCanViewResult(true);
      } else {
        setCanViewResult(false);
      }
    } else {
      // Default: show result immediately
      setCanViewResult(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const answersByQuestionId = useMemo(() => {
    const map = new Map();
    
    // Handle different response structures
    if (result?.answers && Array.isArray(result.answers)) {
      result.answers.forEach((item, index) => {
        // Try different possible keys for question identification
        const key = item.questionId || item.question_id || item.questionIndex || item.question_index || index;
        const answer = item.answer || item.userAnswer || item.user_answer || item.selectedAnswer || item.selected_answer;
        map.set(key, answer);
      });
    } else if (result?.userAnswers && Array.isArray(result.userAnswers)) {
      result.userAnswers.forEach((item, index) => {
        const key = item.questionId || item.question_id || index;
        const answer = item.answer || item.userAnswer || item.user_answer;
        map.set(key, answer);
      });
    } else if (result?.responses && Array.isArray(result.responses)) {
      result.responses.forEach((item, index) => {
        const key = item.questionId || item.question_id || index;
        const answer = item.answer || item.response || item.userAnswer;
        map.set(key, answer);
      });
    }
    
    return map;
  }, [result]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl">
          <p className="text-[#c5f10f] text-lg font-medium">Loading result...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-red-500/30 p-8 rounded-xl">
          <p className="text-red-400 text-lg font-medium">{error}</p>
        </div>
      </section>
    );
  }
  
  // Check if result can be viewed
  if (!canViewResult && resultAvailableDate) {
    return (
      <section className="min-h-screen mt-20 p-4 flex items-center justify-center bg-gradient-to-br from-[#0f141b] via-[#1b232e] to-[#121821]">
        <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] bg-clip-text text-transparent mb-4">
            النتائج غير متاحة بعد
          </h2>
          <p className="text-white/80 mb-4">
            ستكون النتائج متاحة في:
          </p>
          <p className="text-[#c5f10f] font-semibold text-lg">
            {formatDate(resultAvailableDate)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen mt-20 p-4 ">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#c5f10f] to-[#a8d90a] bg-clip-text text-transparent">
            نتائج الامتحان
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-4 rounded-xl">
              <div className="text-sm text-white/70">الدرجة</div>
              <div className="text-2xl font-bold text-[#c5f10f]">{result?.score ?? 0}</div>
            </div>
            <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-4 rounded-xl">
              <div className="text-sm text-white/70">النسبة المئوية</div>
              <div className="text-2xl font-bold text-[#c5f10f]">
                {exam?.questions ? Math.round(((result?.score ?? 0) / exam.questions.length) * 100) : 0}%
              </div>
            </div>
            <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-4 rounded-xl">
              <div className="text-sm text-white/70">تاريخ الإرسال</div>
              <div className="text-sm font-medium text-white">
                {formatDate(result?.submittedAt || result?.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {exam ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">مراجعة تفصيلية للإجابات</h2>
            {exam.questions?.map((q, index) => {
              const qId = q._id || q.id || index;
              const userAnswer = answersByQuestionId.get(qId);
              
              // Handle different correct answer formats
              const correctAnswer = q.correctAnswer || q.answer || q.correct_answer;
              const isCorrect = String(userAnswer || '').toLowerCase() === String(correctAnswer || '').toLowerCase();
              
              return (
                <div
                  key={qId}
                  className="bg-[#1b232e]/80 backdrop-blur rounded-xl shadow border border-[#c5f10f]/20 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      السؤال {index + 1}
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {isCorrect ? "✓ صحيح" : "✗ خطأ"}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-white text-right">
                      {q.questionText || q.question || q.text}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-[#121821] border border-[#c5f10f]/30 p-3 rounded-lg">
                      <div className="text-sm text-white/70 mb-1">إجابتك:</div>
                      <div className="text-white font-medium">
                        {String(userAnswer ?? "لم تجب على هذا السؤال")}
                      </div>
                    </div>
                    
                    {correctAnswer !== undefined && correctAnswer !== null && (
                      <div className="bg-[#121821] border border-green-500/30 p-3 rounded-lg">
                        <div className="text-sm text-white/70 mb-1">الإجابة الصحيحة:</div>
                        <div className="text-green-400 font-medium">
                          {String(correctAnswer)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 p-8 rounded-xl text-center">
            <p className="text-white/70">تفاصيل الامتحان غير متاحة.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
