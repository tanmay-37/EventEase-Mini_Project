import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";

const RecentEvents = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchRecentEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "recentEvents"), 
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRecentEvents(events);
      } catch (err) {
        console.error("Error fetching recent events:", err);
        setError("Failed to load recent events");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
      <h2 className="text-xl font-semibold text-[#4A3F74] mb-4">Recent Events</h2>
      
      {recentEvents.length === 0 ? (
        <p className="text-gray-500">No recent events found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentEvents.map(event => (
            <EventCard key={event.id} event={event} isRecentEvent={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentEvents;