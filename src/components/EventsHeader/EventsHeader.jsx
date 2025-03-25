import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiMapPin, FiLink } from "react-icons/fi";
import { collection, addDoc, getDocs,serverTimestamp } from "firebase/firestore";
import { db} from "../../firebase";    
import imageCompression from "browser-image-compression";




const EventsHeader = () => {
  const [showForm, setShowForm] = useState(false);
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

  const [events, setEvents] = useState([]);  

   // Fetch events from Firestore
   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,          // Add document ID for uniqueness
          ...doc.data()
        }));
        setEvents(eventsArray);   // Store fetched events in state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);


  // Handle input change
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };


  const MAX_IMAGE_SIZE = 1024 * 1024;  // 1MB
  const [loading, setLoading] = useState(false);  // ✅ Add loading state

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      alert("Please select an image.");
      return;
    }
  
    try {
      setLoading(true);
  
      // ✅ Compress the image if larger than 1MB
      let compressedFile = file;
      if (file.size > MAX_IMAGE_SIZE) {
        const options = {
          maxSizeMB: 1,           // Compress below 1MB
          maxWidthOrHeight: 1024,  // Resize dimensions
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, options);
        console.log(`Original size: ${(file.size / 1024).toFixed(2)} KB`);
        console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
      }
  
      // ✅ Convert the compressed image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
  
      reader.onload = () => {
        const base64Image = reader.result;
  
        // ✅ Check final image size (should be < 1MB)
        if (base64Image.length > 1000000) {
          alert("Image is too large even after compression!");
          return;
        }
  
        // ✅ Store Base64 image in event data
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

  // handle submit
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
      // ✅ Store Base64 image in Firestore
      await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
      });
  
      alert("Event added successfully!");
      setShowForm(false);
  
      // ✅ Reset form
      setEventData({
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
  
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event!");
    }
  };
  

  // Utility function to convert 24-hour time to 12-hour format
const formatTimeTo12Hour = (time) => {
  if (!time) return ""; // Handle empty or invalid time
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Handle 12 AM and 12 PM correctly
  return `${formattedHour}:${minutes} ${suffix}`;
};

  return (
    <div className="bg-white shadow-2xl flex flex-col items-center min-h-screen w-full">
      {/* Header */}
      <div className="w-full h-[100px] flex p-4 justify-between items-center bg-purple-200">
        <h2 className="text-2xl font-bold ">Upcoming Events</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2  bg-purple-600 text-white rounded hover:bg-purple-800 transition hover:cursor-pointer"
        >
          Add Event+
        </button>
      </div>

      {/* Event Cards Section */}
      {!showForm && (
        <div className="p-5 gap-6 w-full flex flex-wrap justify-start bg-purple-100">
          {events.length === 0 ? (
            <p className="text-gray-500">No events created yet.</p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="w-[350px] h-auto  bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Event Image */}
                {event.image && (
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-[250px] object-fill"
                  />
                )}

                <div className="p-5">

                  <div className="w-full h-[60px]">
                    <h3 className="text-[1vw] font-bold text-gray-800 mb-3">{event.title}</h3>
                  </div>
                  

                  {/* Event Details Line by Line */}
                  <div className="space-y-2 text-gray-700 flex-grow h-[130px]">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-blue-500" />
                      <p>{event.startDate} {event.endDate ? ` - ${event.endDate}` : ""}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiClock className="text-green-500" />
                      <p>
                      {formatTimeTo12Hour(event.startTime)} 
                      {event.endTime && ` - ${formatTimeTo12Hour(event.endTime)}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-red-500" />
                      <p>{event.venue}</p>
                    </div>

                    {event.registrationLink && (
                      <div className="flex items-center gap-2">
                        <FiLink className="text-purple-500" />
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Registration Link
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Explore/Register Button */}
                  <div className="flex justify-end items-end mt-4">
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center  bg-purple-600 text-white hover:bg-purple-800 px-4 py-2 rounded  transition"
                  >
                    Explore/Register
                  </a>
                </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
          <h2 className="text-xl font-bold mb-4">Create New Event</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Field */}
            <label className="block text-sm font-medium text-gray-700">Upload Event Image</label>
            <input
              type="file"
              accept="image/*"
              name = "image"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              required
            />

            {/* Show loading indicator */}
            {loading && <p className="text-blue-500">Uploading image...</p>}

            {/* Image Preview */}
            {eventData.image && (
              <img
                src={eventData.image}
                alt="Preview"
                className="w-full h-70 object-fill rounded-md mt-2"
              />
            )}
            <p className="text-gray-500 text-sm">
                (Max Size of Image = 1 MB.)
            </p>

            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter event title"
              required
            />

            {/* Description Field (For Future Use) */}
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter event description (for future detail page)"
            />

            {/* Date Fields */}
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

              <p className="text-gray-500 text-sm">
                (If the event is for a single day, ignore the end date.)
              </p>
            </div>

            {/* Time Fields */}
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

            {/* <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
              Create Event
            </button> */}

            <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-3 rounded transition hover:cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}   // ✅ Disable button during upload
          >
            {loading ? "Uploading..." : "Create Event"}
          </button>


          </form>
        </div>
      )}
    </div>
  );
};

export default EventsHeader;
