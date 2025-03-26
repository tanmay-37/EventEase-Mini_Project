import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import imageCompression from "browser-image-compression";
import Logout from '../Logout';

const EventForm = ({ onClose }) => {
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

    if (!file) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      let compressedFile = file;
      if (file.size > 1024 * 1024) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
      }

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = () => {
        const base64Image = reader.result;

        if (base64Image.length > 1000000) {
          alert("Image is too large even after compression!");
          return;
        }

        setEventData((prev) => ({ ...prev, image: base64Image }));
        console.log("Image converted to Base64 and ready for Firestore.");
      };

      reader.onerror = (error) => {
        console.error("Error converting image:", error);
        alert("Failed to convert image!");
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image!");
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            alert("Image is still processing. Please wait...");
            return;
        }

        if (!eventData.image) {
            alert("Please upload an image before submitting.");
            return;
        }

        try {
            console.log("Attempting to add event...");
            await addDoc(collection(db, "events"), {
                ...eventData,
                createdAt: serverTimestamp(),
            });

            console.log("Event added successfully!");
            alert("Event added successfully!");

            setEventData({image: "",
                          title: "",
                          description: "",
                          startDate: "",
                          endDate: "",
                          startTime: "",
                          endTime: "",
                          venue: "",
                          registrationLink: ""
                        });

            //onClose(); // Comment out onClose() temporarily
        } catch (error) {
            console.log("Catch block reached");
            console.error("Error adding event:", error);
            //alert("Failed to add event!"); // Comment out alert temporarily
            console.log("Catch block executed. error message: ", error.message)
            return;
        }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Upload Event Image</label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
          required
        />

        {loading && <p className="text-blue-500">Uploading image...</p>}

        {eventData.image && (
          <img
            src={eventData.image}
            alt="Preview"
            className="w-full h-70 object-fill rounded-md mt-2"
          />
        )}
        <p className="text-gray-500 text-sm">(Max Size of Image = 1 MB.)</p>

        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter event title"
          required
        />

        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter event description (for future detail page)"
        />

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={eventData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input
            type="date"
            name="endDate"
            value={eventData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <p className="text-gray-500 text-sm">(If the event is for a single day, ignore the end date.)</p>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <input
          type="text"
          name="venue"
          value={eventData.venue}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter venue"
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded transition hover:cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Event"}
        </button>
      </form>
      <Logout />
    </div>
  );
};

export default EventForm;