import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import imageCompression from "browser-image-compression";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventForm = ({ onClose }) => {
  const { user } = UserAuth(); 
  const userId = user?.uid;  
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    image: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    registrationLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please select an image.");

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
      reader.onload = () => setEventData((prev) => ({ ...prev, image: reader.result }));
      reader.onerror = () => alert("Failed to convert image!");
    } catch {
      alert("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }
  
    if (loading) return alert("Image is still processing. Please wait...");
    if (!eventData.image) return alert("Please complete all fields.");
  
    try {
      await addDoc(collection(db, "events"), {
        ...eventData,
        userId,  // Ensure valid userId is passed
        createdAt: serverTimestamp()
      });
      alert("Event added successfully!");
      setEventData({
        image: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        venue: "",
        registrationLink: ""
      });
      navigate("/host-dashboard"); 
    } catch (error) {
      console.error("Failed to add event:", error);
      alert("Failed to add event!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-[#1E293B]/80 backdrop-blur-md p-8 rounded-2xl border border-[#38BDF8]/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <h2 className="text-3xl font-bold mb-6 text-[#F1F5F9] text-center">
            Create New Event
            <div className="h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] mx-auto mt-2 rounded-full"></div>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#F1F5F9]/80">Upload Event Image</label>
              <input 
                type="file" 
                accept="image/*" 
                name="image" 
                onChange={handleImageUpload} 
                className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                  text-[#F1F5F9] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                  file:bg-[#38BDF8] file:text-[#0F172A] file:font-semibold
                  hover:file:bg-[#38BDF8]/90 focus:outline-none focus:border-[#38BDF8]/40
                  focus:ring-2 focus:ring-[#38BDF8]/20 transition-all" 
                required 
              />
              {loading && <p className="text-[#38BDF8] text-center">Uploading image...</p>}
              {eventData.image && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-xl blur opacity-20"></div>
                  <img src={eventData.image} alt="Preview" className="w-full rounded-xl relative" />
                </div>
              )}
              <p className="text-[#F1F5F9]/60 text-sm text-center">(Max Size: 1 MB)</p>
            </div>

            {/* Event Details */}
            <input 
              type="text" 
              name="title" 
              value={eventData.title} 
              onChange={handleChange} 
              className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                transition-all" 
              placeholder="Event title" 
              required 
            />

            <textarea 
              name="description" 
              value={eventData.description} 
              onChange={handleChange} 
              className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                transition-all min-h-[100px]" 
              placeholder="Event description" 
            />

            {/* Date/Time Grid */}
            {/* Inside the date/time grid div */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#F1F5F9]/80">Start Date</label>
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

              {/* Start Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#F1F5F9]/80">Start Time</label>
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

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#F1F5F9]/80">End Date</label>
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

              {/* End Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#F1F5F9]/80">End Time</label>
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

            <input 
              type="text" 
              name="venue" 
              value={eventData.venue} 
              onChange={handleChange} 
              className="w-full p-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-xl
                text-[#F1F5F9] placeholder-[#F1F5F9]/30 focus:outline-none
                focus:border-[#38BDF8]/40 focus:ring-2 focus:ring-[#38BDF8]/20
                transition-all" 
              placeholder="Venue" 
              required 
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]
                text-[#0F172A] font-semibold py-3 px-6 rounded-xl
                shadow-[0_0_20px_rgba(56,189,248,0.3)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]
                transition-all duration-300 relative group overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{loading ? "Uploading..." : "Create Event"}</span>
              <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent 
                transition-colors duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;