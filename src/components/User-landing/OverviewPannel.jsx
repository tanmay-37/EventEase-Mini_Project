import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const OverviewPanel = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const { user } = UserAuth(); 

  useEffect(() => {
    if (!user) return;

    const fetchOverviewData = async () => {
      try {
        // Get user's registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);
        setTotalRegistered(registrationsSnap.size);

        // Check upcoming events
        let upcomingCount = 0;
        const now = new Date();

        for (const regDoc of registrationsSnap.docs) {
          const regData = regDoc.data();
          if (!regData.eventId) continue;

          // Get the event document directly
          const eventDoc = await getDoc(doc(db, "events", regData.eventId));
          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            const eventDateTime = new Date(`${eventData.startDate} ${eventData.startTime}`);
            
            if (eventDateTime > now) {
              upcomingCount++;
            }
          }
        }

        setUpcomingEvents(upcomingCount);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, [user]);

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20 p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative z-10">
        Overview
        <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Total Events Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative bg-[#0F172A] p-6 rounded-xl border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 transition-all duration-300">
            <h3 className="text-[#F1F5F9]/80 text-lg font-semibold mb-2">
              Total Events Registered
            </h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-[#F1F5F9] bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] bg-clip-text text-transparent">
                {totalRegistered}
              </p>
              <span className="text-[#F1F5F9]/60 mb-1">events</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative bg-[#0F172A] p-6 rounded-xl border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 transition-all duration-300">
            <h3 className="text-[#F1F5F9]/80 text-lg font-semibold mb-2">
              Upcoming Events
            </h3>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-[#F1F5F9] bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] bg-clip-text text-transparent">
                {upcomingEvents}
              </p>
              <span className="text-[#F1F5F9]/60 mb-1">upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;