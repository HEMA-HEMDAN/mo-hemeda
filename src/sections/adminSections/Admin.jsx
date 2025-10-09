import React, { useEffect } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { useState } from "react";
import Loading from "../../components/rusable/Loading";
const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    document.title = "Admin";
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
      <section className="min-h-screen flex items-center justify-center  p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1b232e] dark:text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your educational platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <DashboardCard
            title="Users"
            description="Manage student accounts"
            icon="👥"
            url={"/admin/users"}
            color="primary"
          />
          <DashboardCard
            title="Academic Years"
            description="Manage academic periods"
            icon="📚"
            url="/admin/academic-years"
            color="secondary"
          />
          
        </div>
      </div>
    </section>
    </>
  );
};

export default Admin;
