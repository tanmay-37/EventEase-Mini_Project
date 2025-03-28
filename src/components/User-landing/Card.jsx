import React from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import EventOverlay from "./EventOverlay";

const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
};

const EventCard = ({ event }) => {
  return (
    <div
      className="relative w-[350px] bg-white shadow-lg rounded-lg 
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
        {/* Event Title (Fades in on Hover) */}
        <h3
          className="text-lg font-bold text-gray-800 mb-2 h-[50px] overflow-hidden 
                     opacity-50 group-hover:opacity-100 transition-opacity duration-300"
        >
          {event.title}
        </h3>

        {/* Event details container */}
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
        </div>
      </div>


    <EventOverlay title={event.title} id={event.id} onRegister={() => alert("Register functionality to be implemented!")} />
    </div>
  );
};

export default EventCard;
