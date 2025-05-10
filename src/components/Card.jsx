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
      className="relative w-full max-w-[350px] bg-[#1E293B] border border-[#38BDF8]/20 
        rounded-xl shadow-lg transition-all duration-300 group hover:scale-[1.02] 
        hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] backdrop-blur-sm p-4"
    >
      {event.image && (
        <img
          src={event.image}
          alt="Event"
          className="w-full h-[200px] object-cover rounded-lg shadow-md 
            group-hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]
            transition-all duration-300"
        />
      )}

      <div className="p-4 flex flex-col h-full">
        {/* Event Title */}
        <h3 className="text-lg font-bold text-[#F1F5F9] mb-4 h-[50px] 
          overflow-hidden transition-opacity duration-300">
          {event.title}
        </h3>

        {!isHost && (
          <div className="space-y-3 text-[#F1F5F9]/80 flex-grow min-h-[100px]">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-[#38BDF8]" />
              <p className="text-sm">
                {event.startDate} {event.endDate ? ` - ${event.endDate}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="text-[#F59E0B]" />
              <p className="text-sm">
                {formatTimeTo12Hour(event.startTime)}{" "}
                {event.endTime && ` - ${formatTimeTo12Hour(event.endTime)}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-[#EF4444]" />
              <p className="text-sm">{event.venue}</p>
            </div>

            {/* Register Button (Mobile) */}
            <button
              className="mt-4 w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                text-[#0F172A] font-semibold py-2.5 px-6 rounded-lg
                shadow-[0_0_20px_rgba(56,189,248,0.3)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
                transition-all duration-300 md:hidden
                relative group overflow-hidden"
              onClick={() => navigate(`/event-details/${event.id}`)}
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-white/20 
                group-hover:bg-transparent transition-colors duration-300"></div>
            </button>
          </div>
        )}

        {isHost && (
          <div className="flex items-center gap-3 text-[#F1F5F9]/80 mt-4">
            <FiUsers className="text-[#38BDF8] text-lg" />
            <p className="text-lg font-semibold">
              {event.registrationCount || 0}{" "}
              {event.registrationCount === 1 ? "Registration" : "Registrations"}
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
          isRegistered={!!event.isRegistered}
          onRegister={() => navigate(`/event-details/${event.id}`)}
          onViewDetails={() => navigate(`/event-details/${event.id}`)}
        />
      </div>
    </div>
  );
};

export default EventCard;