import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext"; 
import { FiUsers } from "react-icons/fi"; 
import Spinner from "../Spinner"; // Importing Spinner component

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const { userType } = UserAuth(); 
  const isHost = userType === "host"; 
  const [loading, setLoading] = useState(true); // State to track loading

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
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-purple-100"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        {/* Event Image */}
        <div className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded-xl">
          <img
            src={event.image}
            alt="Event"
            className="w-auto h-auto max-w-full max-h-96 object-contain"
          />
        </div>
        
        {/* Event Title */}
        <h2 className="text-4xl font-extrabold mt-6 text-gray-800">{event.title}</h2>
        
        {/* Event Description */}
        <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">{event.description}</p>

        {/* Event Date & Venue */}
        <div className="mt-4 text-gray-600 text-lg font-semibold space-y-2">
          <p>📅 {event.endDate ? `${event.startDate} - ${event.endDate}` : event.startDate}</p>
          <p>📍 {event.venue}</p>
        </div>

        {/* Show Host Details for Users Only */}
        {!isHost && event.host && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Host Details</h3>
            <p className="text-gray-700">👤 {event.host.name}</p>
            <p className="text-gray-700">📧 {event.host.email}</p>
          </div>
        )}

        {/* Host View: Show No. of Registrations */}
        {isHost && (
          <div className="flex items-center gap-2 text-gray-700 mt-6">
            <FiUsers className="text-purple-500 text-xl" />
            <p className="text-lg font-medium">
              {event.registrations ?? 0} {event.registrations === 1 ? "Registration" : "Registrations"}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          {!isHost && (
            <button
              className="bg-purple-600 text-white hover:bg-purple-800 px-5 py-2 rounded-lg shadow-md transition"
              onClick={() => navigate(`/event/${id}/register`)}
            >
              Register
            </button>
          )}
          <button
            className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md transition"
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
