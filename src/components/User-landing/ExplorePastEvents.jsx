import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const ExploreAllEvents = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchAllEvents = async () => {
      try {
        setLoading(true);

        // Fetch current registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);

        const currentEventsList = [];
        for (const regDoc of registrationsSnap.docs) {
          const regData = regDoc.data();
          if (!regData.eventId) continue;

          const eventDoc = await getDoc(doc(db, "events", regData.eventId));
          if (eventDoc.exists()) {
            currentEventsList.push({
              id: regDoc.id,
              eventData: { id: eventDoc.id, ...eventDoc.data() },
              ...regData
            });
          }
        }
        setCurrentEvents(currentEventsList);

        // Fetch past events
        const pastEventsQuery = query(
          collection(db, "recentEvents"), 
          where("userId", "==", user.uid)
        );
        const pastEventsSnap = await getDocs(pastEventsQuery);
        const pastEventsList = pastEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isRecent: true
        }));
        setPastEvents(pastEventsList);

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
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#EF4444] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center px-6 py-3 
              bg-[#1E293B] text-[#F1F5F9] rounded-xl
              border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
              shadow-[0_0_20px_rgba(56,189,248,0.1)]
              hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]
              transition-all duration-300"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        ) : errorMessage ? (
          <div className="p-6 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
            <p className="text-[#EF4444] text-center">{errorMessage}</p>
          </div>
        ) : currentEvents.length === 0 && pastEvents.length === 0 ? (
          <div className="p-8 bg-[#1E293B]/50 backdrop-blur-sm border border-[#38BDF8]/20 rounded-xl">
            <p className="text-[#F1F5F9]/70 text-center text-lg">
              You haven't registered for any events yet.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Current Events Section */}
            {currentEvents.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-[#F1F5F9] mb-8 relative">
                  Current Events
                  <div className="absolute -bottom-3 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        <EventCard 
                          event={event.eventData}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-[#F1F5F9] mb-8 relative">
                  Past Events
                  <div className="absolute -bottom-3 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                        <EventCard 
                          event={event}
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

export default ExploreAllEvents;