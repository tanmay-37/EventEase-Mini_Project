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
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={eventData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Start Time */}
        <input
          type="time"
          name="startTime"
          value={eventData.startTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* End Time */}
        <input
          type="time"
          name="endTime"
          value={eventData.endTime}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Description field */}
        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={eventData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
