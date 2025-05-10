import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const MyRegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchAllEvents = async () => {
      try {
        setLoading(true);

        // Fetch current registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);

        const currentEvents = [];
        for (const regDoc of registrationsSnap.docs) {
          const regData = regDoc.data();
          if (!regData.eventId) continue;

          const eventDoc = await getDoc(doc(db, "events", regData.eventId));
          if (eventDoc.exists()) {
            currentEvents.push({
              id: regDoc.id,
              eventData: { id: eventDoc.id, ...eventDoc.data() },
              ...regData
            });
          }
        }

        // Fetch recent (completed) events
        const recentEventsQuery = query(
          collection(db, "recentEvents"), 
          where("userId", "==", user.uid)
        );
        const recentEventsSnap = await getDocs(recentEventsQuery);
        const completedEvents = recentEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isRecent: true
        }));

        setRegisteredEvents(currentEvents);
        setRecentEvents(completedEvents);

      } catch (error) {
        console.error("Error fetching events:", error);
        setErrorMessage("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [user]);

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20 p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative">
        My Registered Events
        <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
      </h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : errorMessage ? (
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
          <p className="text-[#EF4444] text-center">{errorMessage}</p>
        </div>
      ) : registeredEvents.length === 0 && recentEvents.length === 0 ? (
        <div className="p-6 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl border border-[#38BDF8]/20">
          <p className="text-[#F1F5F9]/70 text-center">No events registered yet.</p>
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          {/* Current Events Section */}
          {registeredEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#F1F5F9] relative inline-block">
                Current Events
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#38BDF8]/40"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registeredEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <EventCard event={event.eventData} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events Section */}
          {recentEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#F1F5F9] relative inline-block">
                Completed Events
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#38BDF8]/40"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                      <EventCard event={event} isRecentEvent={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explore All Events Button */}
          <button
            onClick={() => navigate("/explore-all-events")}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
              text-[#0F172A] font-semibold rounded-xl
              shadow-[0_0_20px_rgba(56,189,248,0.3)]
              hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
              transition-all duration-300 hover:scale-[1.02]
              relative z-20 group overflow-hidden"
          >
            <span className="relative z-10">Explore All Your Events</span>
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300"></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegisteredEvents;