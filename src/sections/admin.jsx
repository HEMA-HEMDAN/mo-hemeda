import React, { useState } from 'react'
import UsersTable from "../components/UsersTable.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import AcademicYearsTable from "../components/academicyearcard.jsx";
const Admin = () => {

  const [view, setView] = useState("home")

  return (
    <div className="min-h-screen p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h1>

      {view === "home" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Users"
            description="Manage users, edit details, and delete accounts"
            onClick={() => setView("users")}
          />
          <DashboardCard
            title="exams"
            description="Manage exams"
            onClick={() => setView("exams")}
          />
          <DashboardCard
            title="academic years"
            description="Manage academic years"
            onClick={() => setView("academic years")}
          />
         
        </div>
      )}

      {view === "users" && (
        <div>
          <div className="mb-4">
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setView("home")}>
              ← Back
            </button>
          </div>
          <UsersTable />
        </div>
      )}
       {view === "exams" && (
        <div>
          <div className="mb-4">
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setView("home")}>
              ← Back
            </button>
          </div>
         
        </div>
      )}
       {view === "academic years" && (
        <div>
          <div className="mb-4">
            <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setView("home")}>
              ← Back
            </button>
          </div>
          <AcademicYearsTable />
        </div>
      )}
    </div>
  )
}

export default Admin

