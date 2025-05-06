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
    <div className="min-h-screen flex flex-col p-4 lg:p-6 bg-[#F5F3FF]"
    style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
        <Link 
              to="/host/past-events" 
              className="text-[#4A3F74] hover:text-[#6a5ba7] transition-colors font-medium"
            >
              Past Events
            </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <OverviewPanel />
          <EventManagement />
        <div className="md:col-span-2">
          <CreateEventBtn />
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;