import React from "react";
import { useNavigate } from "react-router-dom";

const EventOverlay = ({ title, isHost, isRegistered, onRegister, onViewDetails, id, isRecentEvent }) => {
  const navigate = useNavigate();

  return (
    <div
      className="absolute left-1/2 bottom-[-60px] w-[250px] h-[160px] 
        bg-[#1E293B]/90 backdrop-blur-lg border border-[#38BDF8]/20 
        rounded-xl flex flex-col justify-center items-center 
        text-center opacity-0 group-hover:opacity-100 
        group-hover:bottom-[-40px] scale-95 group-hover:scale-100 
        transition-all duration-300 -translate-x-1/2 z-[50] p-4 overflow-hidden
        shadow-[0_0_20px_rgba(56,189,248,0.2)]
        group-hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]"
    >
      <h3 className="text-lg font-bold px-2 max-w-full truncate text-[#F1F5F9]">
        {title}
      </h3>

      {isRecentEvent ? (
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={onViewDetails}
            className="bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] text-[#0F172A] 
              font-semibold py-2 px-6 text-lg rounded-lg
              shadow-[0_0_20px_rgba(56,189,248,0.3)]
              hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
              transition-all duration-300 relative group overflow-hidden"
          >
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
              transition-colors duration-300"></div>
          </button>
          <span className="text-sm text-[#F1F5F9]/70 font-medium">
            Event Completed
          </span>
        </div>
      ) : isHost || isRegistered ? (
        <button
          onClick={onViewDetails}
          className="mt-3 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] text-[#0F172A] 
            font-semibold py-2 px-6 text-lg rounded-lg
            shadow-[0_0_20px_rgba(56,189,248,0.3)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
            transition-all duration-300 relative group overflow-hidden"
        >
          <span className="relative z-10">View Details</span>
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
            transition-colors duration-300"></div>
        </button>
      ) : (
        <button
          onClick={onRegister}
          className="mt-3 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] text-[#0F172A] 
            font-semibold py-2 px-6 text-lg rounded-lg
            shadow-[0_0_20px_rgba(56,189,248,0.3)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
            transition-all duration-300 relative group overflow-hidden"
        >
          <span className="relative z-10">Register</span>
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
            transition-colors duration-300"></div>
        </button>
      )}
    </div>
  );
};

export default EventOverlay;