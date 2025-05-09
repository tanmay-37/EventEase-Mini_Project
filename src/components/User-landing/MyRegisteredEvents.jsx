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
    <div className="p-4 bg-white shadow-md rounded-lg relative">
      <h2 className="text-xl font-bold mb-3">My Registered Events</h2>

      {loading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : registeredEvents.length === 0 && recentEvents.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        <div className="space-y-6">
          {/* Current Events Section */}
          {registeredEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#4A3F74] mb-3">
                Current Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="relative z-10">
                    <EventCard 
                      event={event.eventData}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events Section */}
          {recentEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#4A3F74] mb-3">
                Completed Events
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="relative z-10">
                    <EventCard 
                      event={event} 
                      isRecentEvent={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explore All Events Button */}
          <button
            onClick={() => navigate("/explore-all-events")}
            className="mt-4 px-4 py-2 bg-[#A084E8] text-white rounded-md hover:bg-[#8C72D4] w-full z-20 relative pointer-events-auto"
          >
            Explore All Your Events
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegisteredEvents;