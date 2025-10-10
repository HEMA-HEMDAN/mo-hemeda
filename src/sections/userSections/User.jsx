import React, { useEffect, useState } from "react";
import { getUserResults } from "../../services/rusult";
import Loading from "../../components/rusable/Loading";
const User = () => {
  // this one is hell of work you need to do almost the same as the result file so good luck
  useEffect(() => {
    document.title = "User";
  }, []);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  console.log(results);
  return (
    <>
      <Loading />
      <div className="min-h-screen mt-20 p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            My Results
          </h1>

          {results.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">You have no results yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((r) => (
                <div
                  key={r._id || `${r.examId}-${r.userId}`}
                  className=" bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {r.exam?.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Score:{" "}
                      <span className="font-semibold">{r.score ?? 0}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{r.exam?.subject}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popup for exam details */}
      </div>
    </>
  );
};

export default User;
