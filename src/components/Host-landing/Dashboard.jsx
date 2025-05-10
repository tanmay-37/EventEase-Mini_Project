import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import OverviewPanel from "./OverviewPanel";
import EventManagement from "./EventManagement";
import CreateEventBtn from "./CreateEventBtn";
import Spinner from "../Spinner";
const HostDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    const fetchHostEvents = async () => {
      try {
        // Fetch events
        const eventsQuery = query(collection(db, "events"), where("userId", "==", user.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        // Get registration counts for each event
        const eventsWithRegistrations = await Promise.all(
          eventsSnapshot.docs.map(async (eventDoc) => {
            const registrationsQuery = query(
              collection(db, "registrations"),
              where("eventId", "==", eventDoc.id)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            
            return {
              id: eventDoc.id,
              ...eventDoc.data(),
              registrationCount: registrationsSnapshot.size
            };
          })
        );

        setEvents(eventsWithRegistrations);
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching host events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostEvents();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 lg:px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#EF4444] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "url('/images/doodad.png')",
          backgroundSize: "500px",
          backgroundPosition: "left",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-2">
            Host Dashboard
          </h1>
          <p className="text-[#F1F5F9]/60">
            Manage your events and track registrations
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20 p-6">
            <OverviewPanel events={events} />
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20 p-6">
            <EventManagement events={events} />
          </div>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-center mt-8">
          <CreateEventBtn />
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;