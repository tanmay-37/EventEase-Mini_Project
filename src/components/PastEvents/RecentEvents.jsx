import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
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
        const now = Timestamp.now();
        
        const q = query(
          collection(db, "recentEvents")
        );
        
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isCompleted: true
        }));

        // Sort events by end date (most recent first)
        const sortedEvents = events.sort((a, b) => 
          b.endDateTime?.toDate() - a.endDateTime?.toDate()
        );

        setRecentEvents(sortedEvents);
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
    <div className="p-6 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
      <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative inline-block">
        Completed Events
        <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
      </h2>
      
      {recentEvents.length === 0 ? (
        <div className="p-6 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl border border-[#38BDF8]/20">
          <p className="text-[#F1F5F9]/70 text-center">No completed events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEvents.map(event => (
            <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <EventCard 
                  event={event} 
                  isRecentEvent={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentEvents;