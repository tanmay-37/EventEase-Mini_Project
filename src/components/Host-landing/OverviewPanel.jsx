  import { useState, useEffect } from "react";
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  import { db } from "../../firebase";
  import { UserAuth } from "../../context/AuthContext";

import React from 'react';
const OverviewPanel = ({ events }) => {
  const totalRegistrations = events.reduce((total, event) => total + (event.registrationCount || 0), 0);

  return (
    <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
      <h2 className="text-xl font-semibold text-[#4A3F74] mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="text-lg font-semibold text-[#4A3F74]">Total Events</h3>
          <p className="text-2xl font-bold text-[#6a5ba7]">{events.length}</p>
        </div>
        
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="text-lg font-semibold text-[#4A3F74]">Total Registrations</h3>
          <p className="text-2xl font-bold text-[#6a5ba7]">{totalRegistrations}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;