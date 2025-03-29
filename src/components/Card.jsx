import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiUsers } from "react-icons/fi";
import EventOverlay from "./EventOverlay";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
};

const EventCard = ({ event }) => {
  const { user, userType } = UserAuth();
  const navigate = useNavigate();

  const isHost = userType === "host";

  return (
    <div
      className="relative w-full max-w-[350px] bg-white shadow-lg rounded-lg 
                 transition-all duration-500 ease-in-out transform group 
                 hover:scale-105 hover:shadow-2xl p-4 mx-2 mb-6"
    >
      {event.image && (
        <img
          src={event.image}
          alt="Event"
          className="w-full h-[200px] object-fill rounded-t-lg"
        />
      )}

      <div className="p-4 flex flex-col h-full">
        {/* Event Title (Fades in on Hover for Desktop) */}
        <h3
          className="text-lg font-bold text-gray-800 mb-2 h-[50px] overflow-hidden 
                     opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        >
          {event.title}
        </h3>

        {!isHost && (
          <div className="space-y-2 text-gray-700 flex-grow min-h-[100px]">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-500" />
              <p className="text-sm">
                {event.startDate} {event.endDate ? ` - ${event.endDate}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-green-500" />
              <p className="text-sm">
                {formatTimeTo12Hour(event.startTime)}{" "}
                {event.endTime && ` - ${formatTimeTo12Hour(event.endTime)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-red-500" />
              <p className="text-sm">{event.venue}</p>
            </div>

            {/* Register Button (Visible on Mobile for Users) */}
            <button
              className="mt-3 bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white 
                   font-semibold py-2 px-6 text-lg rounded-lg shadow-md 
                   hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] 
                   transition-all duration-300 md:hidden"
              onClick={() => navigate(`/event-details/${event.id}`)}
            >
              Register Now
            </button>
          </div>
        )}

        {isHost && (
          <div className="flex items-center gap-2 text-gray-700 mt-4">
            <FiUsers className="text-purple-500 text-lg" />
            <p className="text-lg font-semibold">
              {event.registrations ?? 0}{" "}
              {event.registrations === 1 ? "Registration" : "Registrations"}
            </p>
          </div>
        )}
      </div>

      {/* Event Overlay */}
      <div className="hidden md:block">
      <EventOverlay
        title={event.title}
        id={event.id}
        isHost={isHost}
        isRegistered={!!event.isRegistered}  // Ensure it's a boolean
        onRegister={() => navigate(`/event-details/${event.id}`)}
        onViewDetails={() => navigate(`/event-details/${event.id}`)}
      />
      </div>
    </div>
  );
};

export default EventCard;