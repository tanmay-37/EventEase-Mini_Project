import React from "react";
import { useNavigate } from "react-router-dom";

const BrowseEventsBtn = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate("/discover")}
        className="group relative inline-flex items-center px-8 py-3 
          bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
          text-[#0F172A] font-semibold rounded-xl
          shadow-[0_0_20px_rgba(56,189,248,0.3)]
          hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
          transition-all duration-300 hover:scale-105
          overflow-hidden"
      >
        <span className="relative z-10">
          Browse New Events
        </span>
        <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
          transition-colors duration-300"></div>
      </button>
    </div>
  );
};

export default BrowseEventsBtn;