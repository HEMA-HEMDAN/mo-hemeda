import React from "react";
import { useNavigate } from "react-router-dom";
import AcademicYearsTable from "../../components/admin/academicyearcard";

const AcademicYears = () => {
  const navigate = useNavigate();

  const handleYearClick = (academicYear) => {
    const yearId = academicYear._id || academicYear.id;
    navigate(`/admin/lessons/${yearId}`);
  };

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
