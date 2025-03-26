import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";


// function to fetch event details from firestore.
const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent(docSnap.data());
        } else {
          console.log("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 min-h-screen bg-purple-200">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <img
          src={event.image}
          alt="Event"
          className="w-full h-96 object-fill rounded-lg mb-6"
        />
        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
        <p className="text-gray-700 mb-2 whitespace-pre-line">{event.description}</p>


        <p className="text-gray-600 font-bold mt-4">
        📅 {event.endDate ? `${event.startDate} - ${event.endDate}` : event.startDate}
        </p>

        <p className="text-gray-600 font-bold">📍 {event.venue}</p>

        <div className="flex justify-between mt-6">
          <button
            className="bg-purple-600 text-white hover:bg-purple-800 px-4 py-2 rounded hover:cursor-pointer"
            onClick={() => navigate(`/event/${id}/register`)} 
          >
            Register
          </button>

          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
