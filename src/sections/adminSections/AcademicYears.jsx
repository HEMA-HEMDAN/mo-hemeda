import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AcademicYearsTable from "../../components/admin/academicyearcard";

const AcademicYears = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleYearClick = (academicYear) => {
    const yearId = academicYear._id || academicYear.id;
    navigate(`/admin/lessons/${yearId}`);
  };
  useEffect(() => {
    const admin = localStorage.getItem("role");
    if (admin === "admin") {
      setIsAdmin(true);
    }
  }, []);
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
    <section className="min-h-screen flex flex-col items-center justify-center">
      <button
        onClick={() => navigate("/admin")}
        className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <AcademicYearsTable onSelectYear={handleYearClick} />
    </section>
  );
};

export default AcademicYears;
