import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { FiUsers } from "react-icons/fi";
import Spinner from "../Spinner";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { user, userType } = UserAuth();
  const isHost = userType === "host";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "registrations"),
          where("eventId", "==", id),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    fetchEvent();
    checkRegistration();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg">Event not found.</p>
      </div>
    );
  }

return (
  <div
    className="p-10 min-h-screen bg-[#0F172A]"
    style={{
      backgroundImage: "url('/images/doodad.png')",
      backgroundSize: "500px",
      backgroundPosition: "left",
      backgroundBlendMode: "soft-light",
      opacity: 0.9
    }}
  >
    <div className="backdrop-blur-lg bg-[#0F172A]/80 border border-[#38BDF8]/20 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <div className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded-xl">
        <img 
          src={event.image} 
          alt="Event" 
          className="w-auto h-auto max-w-full max-h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
        />
      </div>

      <h2 className="text-4xl font-extrabold mt-6 text-[#F1F5F9] bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] bg-clip-text text-transparent">
        {event.title}
      </h2>

      <p className="text-[#F1F5F9]/90 mt-4 leading-relaxed whitespace-pre-line">
        {event.description}
      </p>

      <div className="mt-4 text-[#F1F5F9] text-lg font-semibold space-y-2">
        <p className="flex items-center gap-2">
          <span className="text-[#38BDF8]">📅</span> 
          {event.endDate ? `${event.startDate} - ${event.endDate}` : event.startDate}
        </p>
        <p className="flex items-center gap-2">
          <span className="text-[#38BDF8]">📍</span> 
          {event.venue}
        </p>
      </div>

      {!isHost && event.host && (
        <div className="mt-6 p-4 bg-[#1E293B] rounded-lg border border-[#38BDF8]/20">
          <h3 className="text-lg font-semibold text-[#38BDF8]">Host Details</h3>
          <p className="text-[#F1F5F9]">👤 {event.host.name}</p>
          <p className="text-[#F1F5F9]">📧 {event.host.email}</p>
        </div>
      )}

      {isHost && (
        <div className="mt-6 p-4 bg-[#1E293B] rounded-lg border border-[#38BDF8]/20">
          <div className="flex items-center gap-2 text-[#F1F5F9]">
            <FiUsers className="text-[#38BDF8] text-xl" />
            <p className="text-lg font-medium">
              {event.registrationCount || 0} {" "}
              {event.registrationCount === 1 ? "Registration" : "Registrations"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {!isHost && (
          isRegistered ? (
            <button className="bg-[#1E293B] text-[#F1F5F9]/50 px-5 py-2 rounded-lg border border-[#38BDF8]/20 cursor-not-allowed">
              Already Registered
            </button>
          ) : (
            <button
              className="bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-[#0F172A] px-5 py-2 rounded-lg shadow-lg shadow-[#F59E0B]/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate(`/event/${id}/register`, { state: { eventId: id } })}
            >
              Register
            </button>
          )
        )}

        <button
          className="bg-transparent border-2 border-[#38BDF8] text-[#38BDF8] px-5 py-2 rounded-lg hover:bg-[#38BDF8]/10 transition-all duration-300 transform hover:scale-105"
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
