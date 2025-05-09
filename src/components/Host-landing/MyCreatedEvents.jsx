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
    <div className="min-h-screen bg-[#F5F3FF] py-10 px-5 md:px-20"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/host-dashboard")}
          className="mb-6 px-4 py-2 bg-[#A084E8] text-white rounded-lg hover:bg-[#8C72D4] transition-colors"
        >
          ⬅ Back to Dashboard
        </button>

        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : currentEvents.length === 0 && completedEvents.length === 0 ? (
          <p className="text-center text-gray-600">No events created yet.</p>
        ) : (
          <div className="space-y-8">
            {/* Ongoing Events Section */}
            {currentEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F74] mb-4">Ongoing Events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="flex justify-center">
                      <EventCard event={event} isHost={true} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events Section */}
            {completedEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F74] mb-4">Completed Events</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {completedEvents.map((event) => (
                    <div key={event.id} className="flex justify-center">
                      <EventCard 
                        event={event} 
                        isHost={true}
                        isRecentEvent={true}
                      />
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