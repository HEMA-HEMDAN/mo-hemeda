import React, { useEffect, useState } from "react";
import { getAcademicYears } from "../services/academic-years";

const AcademicYearsTable = () => {
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

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">Academic Years</h2>
        <button
          className="bg-gray-200 px-3 py-1 rounded"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading academic years...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && Array.isArray(academicYears) && (
        <div className="grid gap-3">
          {academicYears.map((u) => {
            const uid = u._id || u.id; // fallback
            const createdAt = u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "Unknown date";

            return (
              <div
                key={uid}
                className="p-4 bg-white shadow rounded flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{u.title || "Untitled"}</h3>
                  <p className="text-sm text-gray-600">Created: {createdAt}</p>

                  {u.telegramChannel && (
                    <a
                      href={u.telegramChannel}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      Telegram Channel
                    </a>
                  )}
                </div>

                {u.image ? (
                  <img
                    src={u.image}
                    alt={u.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-500 rounded">
                    No Image
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AcademicYearsTable;
