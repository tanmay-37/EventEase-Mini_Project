import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const OverviewPanel = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0
  });
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch current events and their registrations
        const currentEventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        const currentEventsSnap = await getDocs(currentEventsQuery);
        
        // Fetch completed events
        const completedEventsQuery = query(
          collection(db, "recentEvents"),
          where("userId", "==", user.uid)
        );
        const completedEventsSnap = await getDocs(completedEventsQuery);

        // Calculate total events
        const totalEvents = currentEventsSnap.size + completedEventsSnap.size;

        // Calculate total registrations
        let totalRegistrations = 0;

        // Count registrations from current events
        for (const doc of currentEventsSnap.docs) {
          const registrationsQuery = query(
            collection(db, "registrations"),
            where("eventId", "==", doc.id)
          );
          const registrationsSnap = await getDocs(registrationsQuery);
          totalRegistrations += registrationsSnap.size;
        }

        // Add registrations from completed events
        for (const doc of completedEventsSnap.docs) {
          // Use the stored registrationCount for completed events
          const eventData = doc.data();
          totalRegistrations += eventData.registrationCount || 0;
        }

        setStats({
          totalEvents,
          totalRegistrations
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative inline-block">
        Overview
        <div className="absolute -bottom-2 left-0 h-1 w-24 
          bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Events Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
            rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative p-6 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl 
            border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 
            transition-all duration-300">
            <h3 className="text-[#F1F5F9]/80 text-lg font-semibold mb-2">
              Total Events Created
            </h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
              bg-clip-text text-transparent">
              {stats.totalEvents}
            </p>
          </div>
        </div>

        {/* Total Registrations Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
            rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative p-6 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl 
            border border-[#38BDF8]/20 hover:border-[#38BDF8]/40 
            transition-all duration-300">
            <h3 className="text-[#F1F5F9]/80 text-lg font-semibold mb-2">
              Total Registrations
            </h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
              bg-clip-text text-transparent">
              {stats.totalRegistrations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;