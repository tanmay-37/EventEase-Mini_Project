import React, { useState } from 'react';

const EventForm = ({ addEvent }) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    startTime: '',     // Added start time
    endTime: '',       // Added end time
    description: '',   // Keep the description field
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.name || !eventData.date || !eventData.startTime || !eventData.endTime) {
      alert("Please fill all the required fields!");
      return;
    }
    addEvent(eventData);
    setEventData({
      name: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      image: ''
    });
  };

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl 
      border border-[#38BDF8]/20 shadow-[0_0_30px_rgba(56,189,248,0.2)] 
      w-full max-w-md">
      
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-8 text-center relative">
        Add Event
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 
          bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#F1F5F9]/80">Event Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter event name"
            value={eventData.name}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
              text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
              focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
              transition-all"
          />
        </div>

        {/* Date and Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
              <FiCalendar className="text-[#38BDF8]" /> Date
            </label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
              className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
              <FiClock className="text-[#F59E0B]" /> Time
            </label>
            <div className="space-y-3">
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                  focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
              />
              <input
                type="time"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
                className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                  focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
            <FiFileText className="text-[#38BDF8]" /> Description
          </label>
          <textarea
            name="description"
            placeholder="Enter event description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
              text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
              focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
              transition-all h-32 resize-none"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
            <FiImage className="text-[#F59E0B]" /> Image URL
          </label>
          <input
            type="text"
            name="image"
            placeholder="Enter image URL"
            value={eventData.image}
            onChange={handleChange}
            className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
              text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
              focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
              transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
            text-[#0F172A] font-semibold py-3 rounded-xl
            shadow-[0_0_20px_rgba(56,189,248,0.3)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
            transition-all duration-300 relative group overflow-hidden"
        >
          <span className="relative z-10">Add Event</span>
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
            transition-colors duration-300"></div>
        </button>
      </form>
    </div>
  );
};

export default EventForm;