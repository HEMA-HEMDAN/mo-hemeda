import React from "react";

const colorMap = {
  blue: {
    ring: "ring-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: "text-blue-600 dark:text-blue-400",
  },
  green: {
    ring: "ring-green-500/20",
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: "text-green-600 dark:text-green-400",
  },
  purple: {
    ring: "ring-purple-500/20",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    icon: "text-purple-600 dark:text-purple-400",
  },
  gray: {
    ring: "ring-white/10",
    bg: "bg-white dark:bg-white/5",
    icon: "text-gray-500 dark:text-white/60",
  },
};

const DashboardCard = ({ title, description, onClick, icon, color = "gray" }) => {
  const c = colorMap[color] || colorMap.gray;
  return (
    <button
      className={`w-full text-left rounded-xl p-4 sm:p-5 transition shadow-sm border border-black/5 dark:border-white/10 ${c.bg} hover:ring-2 ${c.ring}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && <span className={`text-2xl ${c.icon}`}>{icon}</span>}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 mt-1">{description}</p>
            )}
          </div>
        </div>
        <span className="text-gray-400 dark:text-white/50">→</span>
      </div>
    </button>
  );
};

export default DashboardCard;


