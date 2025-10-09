import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AcademicYearsTable from "../../components/admin/academicyearcard";
import Loading from "../../components/rusable/Loading";

const AcademicYears = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleYearClick = (academicYear) => {
    const yearId = academicYear._id || academicYear.id;
    navigate(`/admin/lessons/${yearId}`);
  };
  useEffect(() => {
    document.title = "Academic Years";
  }, []);
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
    <>
      <Loading />
      <section className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        
        <AcademicYearsTable onSelectYear={handleYearClick} />
      </div>
    </section>
    </>
  );
};

export default AcademicYears;
