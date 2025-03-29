import React from "react";
import { useNavigate } from "react-router-dom";

const BrowseEventsBtn = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate("/discover")}
        className="bg-[#A084E8] hover:bg-[#8C72D4] text-white px-6 py-2 rounded-lg font-semibold shadow-md">
        Browse New Events
      </button>
    </div>
  );
};

export default BrowseEventsBtn;
