import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { format } from "date-fns";

const OverviewPanel = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const { user } = UserAuth(); 

  useEffect(() => {
    if (!user) return;

    const fetchOverviewData = async () => {
      try {
        const q = query(collection(db, "registrations"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const registrations = querySnapshot.docs.map((doc) => doc.data());

        setTotalRegistered(registrations.length);

        // Fetch event details to check upcoming events
        const now = new Date();
        let upcomingCount = 0;

        for (const reg of registrations) {
          const eventQuery = query(collection(db, "events"), where("eventId", "==", reg.eventId));
          const eventSnapshot = await getDocs(eventQuery);
          eventSnapshot.forEach((eventDoc) => {
            const eventData = eventDoc.data();
            const eventDate = new Date(eventData.date);
            if (eventDate > now) {
              upcomingCount++;
            }
          });
        }

        setUpcomingEvents(upcomingCount);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, [user]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-100 rounded-lg">
          <h3 className="text-lg font-semibold">Total Events Registered</h3>
          <p className="text-2xl font-bold">{totalRegistered}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-2xl font-bold">{upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
