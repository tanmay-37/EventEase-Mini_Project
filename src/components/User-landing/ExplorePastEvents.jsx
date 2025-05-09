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
    <div
      className="min-h-screen p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#A084E8] text-white rounded-lg hover:bg-[#8C72D4] transition-colors"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : currentEvents.length === 0 && pastEvents.length === 0 ? (
          <p className="text-gray-600 text-center">You haven't registered for any events yet.</p>
        ) : (
          <div className="space-y-8">
            {/* Current Events Section */}
            {currentEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F74] mb-4">Current Events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event.eventData}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F74] mb-4">Past Events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      isRecentEvent={true}
                    />
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