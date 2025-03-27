import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import imageCompression from "browser-image-compression";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventForm = ({ onClose }) => {
  const { userId } = UserAuth(); 
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
    if (loading) return alert("Image is still processing. Please wait...");
    if (!eventData.image || !userId) return alert("Please complete all fields.");
    try {
      await addDoc(collection(db, "events"), { ...eventData, userId, createdAt: serverTimestamp() });
      alert("Event added successfully!");
      setEventData({ image: "", title: "", description: "", startDate: "", endDate: "", startTime: "", endTime: "", venue: "", registrationLink: "" });
    } catch {
      alert("Failed to add event!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Upload Event Image</label>
        <input type="file" accept="image/*" name="image" onChange={handleImageUpload} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" required />
        {loading && <p className="text-blue-500 text-center">Uploading image...</p>}
        {eventData.image && <img src={eventData.image} alt="Preview" className="w-full rounded-lg mt-2 shadow-md" />}
        <p className="text-gray-500 text-sm text-center">(Max Size: 1 MB)</p>

        <input type="text" name="title" value={eventData.title} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="Event title" required />
        <textarea name="description" value={eventData.description} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="Event description" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" value={eventData.startDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" value={eventData.endDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Start Time</label>
            <input type="time" name="startTime" value={eventData.startTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">End Time</label>
            <input type="time" name="endTime" value={eventData.endTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all" />
          </div>
        </div>

        <input type="text" name="venue" value={eventData.venue} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="Venue" required />

        <button type="submit" className={`mt-3 bg-gradient-to-r from-[#A084E8] to-[#8C72D4] text-white font-semibold py-2 px-6 text-lg rounded-lg shadow-md hover:shadow-xl hover:from-[#8C72D4] hover:to-[#705EBB] transition-all duration-300 w-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`} disabled={loading}>{loading ? "Uploading..." : "Create Event"}</button>
      </form>

      <div className="flex justify-between items-center mt-4">
      </div>
    </div>
  );
};

export default EventForm;