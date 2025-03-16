// EventForm.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext } from '../../contexts/EventContext';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    date: '',
    venue: '',
    link: ''
  });
  
  const { addEvent, setIsModalOpen , isModalOpen } = useContext(EventContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent({ ...formData, id: Date.now() });
    setIsModalOpen(false);
    navigate('/events');
  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 rounded border-2  text-black"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Image URL"
            className="w-full p-2  rounded border-2  text-black"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 rounded h-24 border-2  text-black"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="date"
            className="w-full p-2  rounded border-2 text-black"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Venue"
            className="w-full p-2 rounded border-2  text-black"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Registration Link"
            className="w-full p-2 rounded border-2  text-black"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;