import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const RegisteredEvents = () => {
  const { userId } = UserAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (userId) {
      const fetchEvents = async () => {
        const q = query(collection(db, "registrations"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const registeredEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(registeredEvents);
      };
      fetchEvents();
    }
  }, [userId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
      <h2 className="text-xl font-bold mb-4">My Registered Events</h2>
      {events.length === 0 ? <p>No events registered.</p> : events.map(event => (
        <div key={event.id} className="border p-4 rounded mb-2">
          <h3 className="font-bold">{event.title}</h3>
          <p>{event.venue}</p>
          <p>{event.startDate}</p>
        </div>
      ))}
    </div>
  );
};

export default RegisteredEvents;