import React from "react";
import { getExamResults } from "../../services/rusult";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminResults = () => {
  const { examId } = useParams();

  const [results, setResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const admin = localStorage.getItem("role");
    if (admin === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getExamResults(examId);
        setResults(res);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    fetchResults();
  }, [examId]);
  {
    if (!isAdmin) {
      return (
        <section className=" h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            You are not admin
          </h1>
        </section>
      );
    }
  }
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f141b] to-[#1b232e] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Exam Results
          </h1>
          <p className="text-gray-300 text-lg">
            View student performance and scores
          </p>
        </div>

        {results.length > 0 ? (
          <div className="bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#c5f10f]/20">
                <thead className="bg-[#121821]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      👤 User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      📱 Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      📧 Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      📊 Result
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0f141b] divide-y divide-[#c5f10f]/20">
                  {results.map((result) => (
                    <tr key={result._id} className="hover:bg-[#1b232e]/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {result.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {result.user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {result.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#c5f10f]/20 text-[#c5f10f] border border-[#c5f10f]/30">
                          {result.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-400">
              No students have taken this exam yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminResults;
