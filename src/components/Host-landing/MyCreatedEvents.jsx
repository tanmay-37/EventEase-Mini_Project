import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";

const MyCreatedEvents = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchAllEvents = async () => {
      try {
        setLoading(true);

        // Fetch current/ongoing events
        const currentEventsQuery = query(
          collection(db, "events"), 
          where("userId", "==", user.uid)
        );
        const currentEventsSnap = await getDocs(currentEventsQuery);
        const currentEventsList = currentEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCurrentEvents(currentEventsList);

        // Fetch completed events
        const completedEventsQuery = query(
          collection(db, "recentEvents"), 
          where("userId", "==", user.uid)
        );
        const completedEventsSnap = await getDocs(completedEventsQuery);
        const completedEventsList = completedEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isRecent: true
        }));
        setCompletedEvents(completedEventsList);

      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/host-dashboard")}
          className="group relative inline-flex items-center px-6 py-2 
            bg-[#1E293B] text-[#F1F5F9] font-semibold rounded-xl
            border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
            shadow-[0_0_20px_rgba(56,189,248,0.1)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
            transition-all duration-300 hover:scale-105"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to Dashboard
        </button>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        ) : errorMessage ? (
          <div className="p-6 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
            <p className="text-[#EF4444] text-center">{errorMessage}</p>
          </div>
        ) : currentEvents.length === 0 && completedEvents.length === 0 ? (
          <div className="p-8 bg-[#1E293B]/50 backdrop-blur-sm border border-[#38BDF8]/20 rounded-xl">
            <p className="text-[#F1F5F9]/70 text-center text-lg">
              No events created yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Ongoing Events Section */}
            {currentEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative inline-block">
                  Ongoing Events
                  <div className="absolute -bottom-2 left-0 h-1 w-24 
                    bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                          rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        <EventCard event={event} isHost={true} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events Section */}
            {completedEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative inline-block">
                  Completed Events
                  <div className="absolute -bottom-2 left-0 h-1 w-24 
                    bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {completedEvents.map((event) => (
                    <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                          rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        <EventCard 
                          event={event} 
                          isHost={true}
                          isRecentEvent={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCreatedEvents;