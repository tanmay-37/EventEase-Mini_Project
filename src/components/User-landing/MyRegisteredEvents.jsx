import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const MyRegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchRegisteredEvents = async () => {
      try {
        console.log("Fetching registered events for user:", user.uid);

        // Step 1: Fetch registrations where userId matches
        const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No registered events found for this user.");
          setRegisteredEvents([]);
          setLoading(false);
          return;
        }

        // Step 2: Extract event IDs
        const eventRegistrations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          eventId: doc.data().eventId,
          ...doc.data(),
        }));

        console.log("User's registered events (raw):", eventRegistrations);

        // Step 3: Fetch event details
        const validEvents = [];
        for (const reg of eventRegistrations) {
          if (!reg.eventId) continue; // Skip if eventId is missing

          const eventRef = doc(db, "events", reg.eventId);
          const eventDoc = await getDoc(eventRef);

          if (eventDoc.exists()) {
            validEvents.push({
              ...reg,
              eventData: eventDoc.data(), // Fetch actual event details
            });
          }
        }

        console.log("Filtered valid events:", validEvents);
        setRegisteredEvents(validEvents);
      } catch (error) {
        setErrorMessage("Failed to fetch registered events. Please try again.");
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">My Registered Events</h2>

      {loading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : registeredEvents.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registeredEvents.slice(0, showAll ? registeredEvents.length : 2).map((event) => (
            <EventCard key={event.id} event={event.eventData} />
          ))}

          {registeredEvents.length > 2 && !showAll && (
            <button
              onClick={() => navigate("/explore-all-events")}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Explore All Your Past Events
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRegisteredEvents;
