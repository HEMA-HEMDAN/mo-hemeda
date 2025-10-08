import React from "react";
import { getExamResults } from "../../services/rusult";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminResults = () => {
  const { examId } = useParams();

  const [results, setResults] = useState([]);

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

  return (
    <section className="h-screen flex items-center justify-center">
      {results.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {results.map((result) => (
              <tr key={result._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                  {result.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                  {result.user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                  {result.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-900">
                  {result.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-3xl">No results found.</p>
      )}
    </section>
  );
};

export default AdminResults;
