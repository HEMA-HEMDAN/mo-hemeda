import React from "react";

const DashboardCard = ({ title, description, onClick }) => {
  return (
    <button
      className="w-full text-left border rounded-lg p-4 hover:shadow-md transition bg-white"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        <span className="text-gray-400">→</span>
      </div>
    </button>
  );
};

export default DashboardCard;


