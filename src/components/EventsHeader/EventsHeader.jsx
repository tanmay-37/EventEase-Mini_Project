import { useState } from "react";

const EventsHeader = () => {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]); // Store event cards

  const [eventData, setEventData] = useState({
    image: "",
    title: "",
    description: "",
    date: "",
    venue: "",
    registrationLink: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setEventData({ ...eventData, image: reader.result });
      };
    }
  };

  // Submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, eventData]); // Add event to list
    setShowForm(false); // Hide form after event creation
    setEventData({ image: "", title: "", description: "", date: "", venue: "", registrationLink: "" }); // Reset form
  };

  return (
    <div className="bg-white  shadow-2xl flex flex-col items-center min-h-screen w-auto">
      {/* Header */}
      <div className="w-full h-[100px] flex p-4 justify-between items-center bg-[#D1C2FF]">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Event+
        </button>
      </div>

      {/* Event Cards Section */}
      {!showForm && (
        <div className=" p-5 gap-4 w-full flex flex-wrap min-h-screen justify-start bg-purple-300 ">
          {events.length === 0 ? (
            <p className="text-gray-500">No events created yet.</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="w-120 h-[800px] bg-white shadow-md p-2 rounded-lg">
                {event.image && <img src={event.image} alt="Event" className="w-full object-contain h-70  rounded-md" />}
                <h3 className="text-lg font-bold mt-4">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{event.date} | {event.venue}</p>
                <p className="text-gray-700 mt-4 whitespace-pre-line h-auto max-h-[500px] overflow-hidden">{event.description}</p>
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                  className="mt-4 block text-blue-600 hover:underline">
                  Register Here
                </a>
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
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded" required />
            
            {/* Image Preview */}
            {eventData.image && <img src={eventData.image} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" />}

            <input type="text" name="title" value={eventData.title} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Enter event title" required />

            <textarea name="description" value={eventData.description} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Enter event description" required />

            <input type="date" name="date" value={eventData.date} onChange={handleChange}
              className="w-full p-2 border rounded" required />

            <input type="text" name="venue" value={eventData.venue} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Enter venue" required />

            <input type="text" name="registrationLink" value={eventData.registrationLink} onChange={handleChange}
              className="w-full p-2 border rounded" placeholder="Enter registration link" required />

            <div className="flex justify-between">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                Cancel
              </button>
              <button type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventsHeader;
