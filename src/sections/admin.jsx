import React, { useState } from 'react'
import { useSearchParams } from "react-router-dom";
import UsersTable from "../components/UsersTable.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import AcademicYearsTable from "../components/academicyearcard.jsx";
import { getLessonsByYearId } from "../services/lessons";
const Admin = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "home";
  const [selectedYear, setSelectedYear] = useState(null);
  const selectedYearId = searchParams.get("yearId") || "";
  const selectedLessonId = searchParams.get("lessonId") || "";
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const setView = (v) => setSearchParams((prev) => {
    const p = new URLSearchParams(prev);
    if (v) p.set("view", v); else p.delete("view");
    if (v !== "lessons" && v !== "add-exam") {
      p.delete("yearId");
      p.delete("lessonId");
    }
    return p;
  });

  const goBack = () => {
    if (view === "users" || view === "exams" || view === "academic years") return setView("home");
    if (view === "lessons") return setView("academic years");
    if (view === "add-exam") setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set("view", "lessons"); return p; });
  };

  React.useEffect(() => {
    const load = async () => {
      if (view === "lessons" && (selectedYear?._id || selectedYearId)) {
        try {
          setLoadingLessons(true);
          const yearId = selectedYear?._id || selectedYearId;
          const data = await getLessonsByYearId(yearId);
          setLessons(Array.isArray(data) ? data : []);
        } finally {
          setLoadingLessons(false);
        }
      }
    };
    load();
  }, [view, selectedYear, selectedYearId]);

  return (
    <div className="min-h-screen mt-20 px-4 sm:px-6 md:px-8">
      <header className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70 text-sm">Manage users, exams, and academic years</p>
        </div>
        {view !== "home" && (
          <button className="bg-white/90 text-gray-900 px-3 py-1.5 rounded border border-black/10 shadow-sm hover:bg-white active:scale-95" onClick={goBack}>
            ← Back
          </button>
        )}
      </header>

      {view === "home" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Users"
            description="Manage users, edit details, and delete accounts"
            icon="👤"
            color="blue"
            onClick={() => setView("users")}
          />
         
          <DashboardCard
            title="Academic Years"
            description="Configure academic year settings"
            icon="📚"
            color="purple"
            onClick={() => setView("academic years")}
          />
        </div>
      )}

      {view === "users" && (
        <div className="pb-8">
          <UsersTable />
        </div>
      )}

     

      {view === "academic years" && (
        <div className="pb-8">
          <AcademicYearsTable
            onSelectYear={(year) => {
              setSelectedYear(year);
              setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                p.set("view", "lessons");
                p.set("yearId", year._id || year.id || "");
                return p;
              });
            }}
          />
        </div>
      )}
      </div>
)}
      
           
        

export default Admin

