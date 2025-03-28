import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const ExploreAllEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);

        // Step 1: Get user's registrations
        const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No registered events found.");
          setRegisteredEvents([]);
          setLoading(false);
          return;
        }

        // Step 2: Extract event IDs and fetch event details
        const eventDetails = [];
        for (const regDoc of querySnapshot.docs) {
          const regData = regDoc.data();
          if (!regData.eventId) continue; // Skip if eventId is missing

          const eventRef = doc(db, "events", regData.eventId);
          const eventDoc = await getDoc(eventRef);

          if (eventDoc.exists()) {
            eventDetails.push({
              id: regDoc.id, // Keep registration ID
              eventData: eventDoc.data(), // Fetch actual event details
              ...regData, // Keep original registration details
            });
          }
        }

        console.log("Registered events with details:", eventDetails);
        setRegisteredEvents(eventDetails);
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
    <div
      className="min-h-screen p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
        >
          ⬅ Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">All Registered Events</h1>

        {loading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : registeredEvents.length === 0 ? (
          <p className="text-gray-600">You haven't registered for any events yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registeredEvents.map((event) => (
              <EventCard key={event.id} event={event.eventData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreAllEvents;
