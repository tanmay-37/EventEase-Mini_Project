import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import EventCard from "../Card";
import Spinner from "../Spinner";

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchPastEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, "pastCreatedEvents"), 
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPastEvents(events);
      } catch (err) {
        console.error("Error fetching past events:", err);
        setError("Failed to load past events");
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
      <h2 className="text-xl font-semibold text-[#4A3F74] mb-4">Past Created Events</h2>
      
      {pastEvents.length === 0 ? (
        <p className="text-gray-500">No past events found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastEvents.map(event => (
            <EventCard key={event.id} event={event} isPastEvent={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PastEvents;