import React, { useEffect } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { useState } from "react";
const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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
    <section className=" h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin
        </h1>
        <DashboardCard
          title="Users"
          description="Manage users"
          icon="👥"
          url={"/admin/users"}
          color="blue"
        />
        <DashboardCard
          title="academic years"
          description="Manage academic years"
          icon="👥"
          url="/admin/academic-years"
          color="blue"
        />
      </div>
    </section>
  );
};

export default Admin;
