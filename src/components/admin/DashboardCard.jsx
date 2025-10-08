import { Link } from "react-router-dom";
import React from "react";

const colorMap = {
  primary: {
    ring: "ring-[#c5f10f]/30",
    bg: "bg-[#1b232e]/80 backdrop-blur border border-[#c5f10f]/20",
    icon: "text-[#c5f10f]",
    hover: "hover:bg-[#1b232e] hover:border-[#c5f10f]/40",
  },
  secondary: {
    ring: "ring-[#c5f10f]/30",
    bg: "bg-[#121821]/80 backdrop-blur border border-[#c5f10f]/20",
    icon: "text-[#c5f10f]",
    hover: "hover:bg-[#121821] hover:border-[#c5f10f]/40",
  },
  accent: {
    ring: "ring-[#c5f10f]/30",
    bg: "bg-[#0f141b]/80 backdrop-blur border border-[#c5f10f]/20",
    icon: "text-[#c5f10f]",
    hover: "hover:bg-[#0f141b] hover:border-[#c5f10f]/40",
  },
  gray: {
    ring: "ring-white/10",
    bg: "bg-white/5 backdrop-blur border border-white/10",
    icon: "text-white/60",
    hover: "hover:bg-white/10",
  },
};

const DashboardCard = ({ title, description, url, icon, color = "gray" }) => {
  const c = colorMap[color] || colorMap.gray;
  return (
    <Link
      className={`w-full text-left rounded-2xl p-6 transition-all duration-300 shadow-xl ${c.bg} ${c.hover} hover:ring-2 ${c.ring} hover:scale-105 group`}
      to={url}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && <span className={`text-3xl ${c.icon} group-hover:scale-110 transition-transform duration-300`}>{icon}</span>}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                {description}
              </p>
            )}
          </div>
        </div>
        <span className="text-[#c5f10f] text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
      </div>
    </Link>
  );
};

export default DashboardCard;
