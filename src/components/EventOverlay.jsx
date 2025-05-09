import React from "react";
import { useNavigate } from "react-router-dom";

const EventOverlay = ({ title, isHost, isRegistered, onRegister, onViewDetails, id, isRecentEvent }) => {
  const navigate = useNavigate();

  return (
    <div
      className="absolute left-1/2 bottom-[-60px] w-[250px] h-[160px] 
                 bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.37)] 
                 rounded-xl flex flex-col justify-center items-center text-[#4A3F74] 
                 text-center opacity-0 group-hover:opacity-100 
                 group-hover:bottom-[-40px] scale-95 group-hover:scale-100 
                 transition-all duration-300 -translate-x-1/2 z-[50] p-4 overflow-hidden"
    >
      <h3 className="text-lg font-bold px-2 max-w-full truncate text-[#4A3F74]">
        {title}
      </h3>

      {isRecentEvent ? (
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={onViewDetails}
            className="bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white 
                     font-semibold py-2 px-6 text-lg rounded-lg shadow-md 
                     hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] 
                     transition-all duration-300"
          >
            View Details
          </button>
          <span className="text-sm text-[#4A3F74] font-medium">
            Event Completed
          </span>
        </div>
      ) : isHost || isRegistered ? (
        <button
          onClick={onViewDetails}
          className="mt-3 bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white 
                   font-semibold py-2 px-6 text-lg rounded-lg shadow-md 
                   hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] 
                   transition-all duration-300"
        >
          View Details
        </button>
      ) : (
        <button
          onClick={onRegister}
          className="mt-3 bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white 
                   font-semibold py-2 px-6 text-lg rounded-lg shadow-md 
                   hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] 
                   transition-all duration-300"
        >
          Register
        </button>
      )}
    </div>
  );
};

export default EventOverlay;