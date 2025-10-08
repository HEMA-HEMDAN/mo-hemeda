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
    <section className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="text-[#c5f10f] hover:text-white font-medium mb-6 flex items-center gap-2 transition-colors duration-300"
        >
          ← Back to Dashboard
        </button>
        <AcademicYearsTable onSelectYear={handleYearClick} />
      </div>
    </section>
  );
};

export default AcademicYears;
