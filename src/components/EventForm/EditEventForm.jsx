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
    <div className="fixed inset-0 min-h-screen bg-[#F5F3FF] backdrop-blur-md z-50 overflow-y-auto"
         style={{
           backgroundImage: "url('/images/doodad.png')",
           backgroundSize: "500px",
           backgroundPosition: "left",
         }}>
      {/* Close button at top */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose} 
          className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md"
        >
          <FiX className="text-[#4A3F74] text-xl" />
        </button>
      </div>

      {/* Main content */}
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-[#4A3F74] mb-8 text-center">
            Edit Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section with larger preview */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[#4A3F74] flex items-center gap-2">
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
                  className="block w-full p-6 border-2 border-dashed border-[#A084E8] rounded-2xl 
                           hover:border-[#8C72D4] transition-colors cursor-pointer 
                           text-center text-gray-600 hover:text-[#8C72D4]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiUpload className="text-2xl" />
                    <span>Click to upload image</span>
                  </div>
                </label>
              </div>
              {eventData.image && (
                <div className="relative group">
                  <img
                    src={eventData.image}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                                transition-opacity rounded-2xl flex items-center justify-center">
                    <span className="text-white">Click to change image</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event Details Section */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-[#4A3F74]">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                           focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                           transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4A3F74]">Description</label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                           focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                           transition-all h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Section */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-[#4A3F74] flex items-center gap-2">
                    <FiCalendar /> Event Dates
                  </label>
                  <div className="space-y-3">
                    <input
                      type="date"
                      name="startDate"
                      value={eventData.startDate}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                               focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                               transition-all"
                      required
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={eventData.endDate}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                               focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                               transition-all"
                    />
                  </div>
                </div>

                {/* Time Section */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-[#4A3F74] flex items-center gap-2">
                    <FiClock /> Event Time
                  </label>
                  <div className="space-y-3">
                    <input
                      type="time"
                      name="startTime"
                      value={eventData.startTime}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                               focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                               transition-all"
                      required
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={eventData.endTime}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                               focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                               transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#4A3F74] flex items-center gap-2">
                  <FiMapPin /> Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/50 border border-[#A084E8]/30 rounded-xl 
                           focus:outline-none focus:border-[#A084E8] focus:ring-2 focus:ring-[#A084E8]/20 
                           transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#A084E8] to-[#8C72D4] 
                        text-white font-semibold py-4 rounded-xl shadow-md
                        hover:from-[#8C72D4] hover:to-[#705EBB] 
                        transition-all duration-300 transform hover:scale-[1.02]
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Event"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;