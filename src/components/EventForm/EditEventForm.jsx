import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import imageCompression from "browser-image-compression";
import { FiX, FiUpload, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

const EditEventForm = ({ event, onClose, onUpdate }) => {
  const [eventData, setEventData] = useState({
    image: event.image || "",
    title: event.title || "",
    description: event.description || "",
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    venue: event.venue || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      let compressedFile = file;
      if (file.size > 1024 * 1024) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => setEventData(prev => ({ ...prev, image: reader.result }));
      reader.onerror = () => alert("Failed to convert image!");
    } catch (error) {
      alert("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, eventData);
      onUpdate(eventData);
      onClose();
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-md z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-16 flex items-center justify-center">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="fixed top-4 right-4 p-2 bg-[#1E293B] hover:bg-[#1E293B]/80 
            rounded-full transition-colors border border-[#38BDF8]/20 
            shadow-[0_0_20px_rgba(56,189,248,0.1)]
            hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
            z-50"
        >
          <FiX className="text-[#F1F5F9] text-xl" />
        </button>

        {/* Main content */}
        <div className="w-full max-w-3xl">
          <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 
            border border-[#38BDF8]/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-6 sm:mb-8 text-center relative">
              Edit Event
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 
                bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
                  <FiUpload /> Event Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label 
                    htmlFor="imageUpload"
                    className="block w-full p-4 sm:p-6 border-2 border-dashed border-[#38BDF8]/30 
                      rounded-2xl hover:border-[#38BDF8]/60 transition-colors cursor-pointer 
                      text-center text-[#F1F5F9]/60 hover:text-[#F1F5F9]
                      bg-[#0F172A]/50"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FiUpload className="text-2xl" />
                      <span>Click to upload image</span>
                    </div>
                  </label>
                </div>
                {eventData.image && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] 
                      rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                    <img
                      src={eventData.image}
                      alt="Preview"
                      className="w-full h-48 sm:h-64 object-cover rounded-xl relative"
                    />
                    <div className="absolute inset-0 bg-[#0F172A]/60 opacity-0 group-hover:opacity-100 
                      transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-[#F1F5F9]">Click to change image</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Details Section */}
              <div className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Event Title"
                  className="w-full p-3 sm:p-4 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all"
                  required
                />

                {/* Description Input */}
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Event Description"
                  className="w-full p-3 sm:p-4 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                    text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                    focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                    transition-all h-24 sm:h-32 resize-none"
                />

                {/* Venue Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
                    <FiMapPin className="text-[#EF4444]" /> Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={eventData.venue}
                    onChange={handleChange}
                    placeholder="Event Venue"
                    className="w-full p-3 sm:p-4 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                      text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                      focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                      transition-all"
                    required
                  />
                </div>

                {/* Date/Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Date Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
                      <FiCalendar className="text-[#38BDF8]" /> Event Dates
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-[#F1F5F9]/60 block mb-1">Start Date*</label>
                        <input
                          type="date"
                          name="startDate"
                          value={eventData.startDate}
                          onChange={handleChange}
                          className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                            text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                            focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#F1F5F9]/60 block mb-1">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={eventData.endDate}
                          onChange={handleChange}
                          className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                            text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                            focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-[#F1F5F9]/80 flex items-center gap-2">
                      <FiClock className="text-[#F59E0B]" /> Event Time
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-[#F1F5F9]/60 block mb-1">Start Time*</label>
                        <input
                          type="time"
                          name="startTime"
                          value={eventData.startTime}
                          onChange={handleChange}
                          className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                            text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                            focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#F1F5F9]/60 block mb-1">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          value={eventData.endTime}
                          onChange={handleChange}
                          className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                            text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]/40
                            focus:ring-2 focus:ring-[#38BDF8]/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 sm:mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
                      text-[#0F172A] font-semibold py-3 sm:py-4 rounded-xl
                      shadow-[0_0_20px_rgba(56,189,248,0.3)]
                      hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
                      transition-all duration-300 relative group overflow-hidden
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">
                      {loading ? "Updating..." : "Update Event"}
                    </span>
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
                      transition-colors duration-300"></div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;