import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { UserAuth } from "../../context/AuthContext";
import OverviewPanel from "./OverviewPannel";
import MyRegisteredEvents from "./MyRegisteredEvents";
import DiscoverBtn from "./DiscoverBtn";
import Spinner from "../Spinner";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    const fetchUserEvents = async () => {
      try {
        const q = query(collection(db, "eventRegistrations"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const eventsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsArray);
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col p-4 lg:p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <OverviewPanel />
        <MyRegisteredEvents />
        <div className="md:col-span-2">
          <DiscoverBtn />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
