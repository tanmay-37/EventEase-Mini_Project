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
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

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
    <div>
      <div className="min-h-screen flex flex-col p-4 lg:p-6 bg-[#F5F3FF]"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>

        // Add this in your navigation section
<Link 
  to="/user/recent-events"
  className="text-[#4A3F74] hover:text-[#6a5ba7] transition-colors"
>
  Recent Events
</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <OverviewPanel />
        <MyRegisteredEvents />
      </div>
      <div className="w-full flex justify-center mt-6 relative z-50 pointer-events-auto">
        <button
          onClick={() => navigate("/discover")}
          className="bg-[#A084E8] hover:bg-[#8C72D4] text-white px-6 py-2 rounded-lg font-semibold shadow-md w-full max-w-[300px] sm:w-auto">
          Browse New Events
        </button>
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
