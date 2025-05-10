import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import OverviewPanel from "./OverviewPannel";
import MyRegisteredEvents from "./MyRegisteredEvents";
import DiscoverBtn from "./DiscoverBtn";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUserEvents = async () => {
      try {
        // Fetch user registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);

        // Get all registered event IDs
        const eventIds = registrationsSnap.docs.map(doc => doc.data().eventId);

        if (eventIds.length > 0) {
          // Fetch event details for each registration
          const currentDate = new Date();
          const upcomingEventsList = [];
          
          for (const eventId of eventIds) {
            const eventDoc = await getDocs(doc(db, "events", eventId));
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              const eventDate = new Date(`${eventData.startDate} ${eventData.startTime}`);
              
              // Check if event is upcoming
              if (eventDate > currentDate) {
                upcomingEventsList.push({
                  id: eventDoc.id,
                  ...eventData
                });
              }
            }
          }

          // Sort upcoming events by date
          const sortedUpcomingEvents = upcomingEventsList.sort((a, b) => {
            const dateA = new Date(`${a.startDate} ${a.startTime}`);
            const dateB = new Date(`${b.startDate} ${b.startTime}`);
            return dateA - dateB;
          });

          setUpcomingEvents(sortedUpcomingEvents);
        }

        setEvents(registrationsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

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
            Welcome Back, {user?.displayName || 'User'}
          </h1>
          <p className="text-[#F1F5F9]/60">
            Manage your events and discover new experiences
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OverviewPanel upcomingEvents={upcomingEvents} />
          <MyRegisteredEvents />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <button
            onClick={() => navigate("/discover")}
            className="group relative inline-flex items-center px-8 py-3 
              bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
              text-[#0F172A] font-semibold rounded-xl
              shadow-[0_0_20px_rgba(56,189,248,0.3)]
              hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
              transition-all duration-300 hover:scale-105
              w-full sm:w-auto max-w-[300px] justify-center
              overflow-hidden"
          >
            <span className="relative z-10">Browse New Events</span>
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
              transition-colors duration-300"></div>
          </button>

          <button
            onClick={() => navigate("/user/recent-events")}
            className="group relative inline-flex items-center px-8 py-3
              bg-[#1E293B] text-[#F1F5F9] font-semibold rounded-xl
              border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
              shadow-[0_0_20px_rgba(56,189,248,0.1)]
              hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
              transition-all duration-300 hover:scale-105
              w-full sm:w-auto max-w-[300px] justify-center
              backdrop-blur-sm"
          >
            <span className="relative z-10">Recent Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;