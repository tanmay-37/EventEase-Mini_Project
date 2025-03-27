import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../User-landing/Card";
import Logout from "../Logout";
import { UserAuth } from "../../context/AuthContext";

const HostDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth(); // Get logged-in user info

  useEffect(() => {
    if (!user) return;

    const fetchHostEvents = async () => {
      try {
        const q = query(collection(db, "events"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const eventsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsArray);
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching host events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostEvents();
  }, [user]);

  return (
    <div>
      <section className="min-h-screen bg-gray-100 py-10 px-5 md:px-20 relative overflow-visible">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Hosted Events
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600">No events found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none p-0 relative overflow-visible">
            {events.map((event) => (
              <li key={event.id} className="flex justify-center relative overflow-visible">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <Logout />
    </div>
  );
};

export default HostDashboard;