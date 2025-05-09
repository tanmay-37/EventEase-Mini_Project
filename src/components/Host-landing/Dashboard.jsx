import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import OverviewPanel from "./OverviewPanel";
import EventManagement from "./EventManagement";
import CreateEventBtn from "./CreateEventBtn";
import Spinner from "../Spinner";
const HostDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    const fetchHostEvents = async () => {
      try {
        // Fetch events
        const eventsQuery = query(collection(db, "events"), where("userId", "==", user.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        // Get registration counts for each event
        const eventsWithRegistrations = await Promise.all(
          eventsSnapshot.docs.map(async (eventDoc) => {
            const registrationsQuery = query(
              collection(db, "registrations"),
              where("eventId", "==", eventDoc.id)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            
            return {
              id: eventDoc.id,
              ...eventDoc.data(),
              registrationCount: registrationsSnapshot.size
            };
          })
        );

        setEvents(eventsWithRegistrations);
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching host events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostEvents();
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col p-4 lg:p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <OverviewPanel events={events} />
        <EventManagement events={events} />
        <div className="md:col-span-2">
          <CreateEventBtn />
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;