import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext'; // import context

// event card template details
const EventForm = () => {
  const {addEvent} = useEvents(); // get addEvent function from context
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    image: '',
    title: '',
    description: '',
    date: '',
    venue: '',
    registrationLink: ''
  });
  
  const [preview, setPreview] = useState(null); // To show image preview


  const handleChange = (e) => {
    setEvent({ ...event , [e.target.name] : e.target.value});
  }

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64
      reader.onloadend = () => {
        setEvent({ ...event, image: reader.result }); // Store base64 string
        setPreview(reader.result); // Show preview
      };
    }
  };


  // handling form submit actions
  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(event);
    console.log('Event Created :' , event);
    navigate('/'); // Redirect to events page after form submission
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
          
        {/* Image Upload Field */}
        <label className="block text-sm font-medium text-gray-700">Upload Event Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} 
            className="w-full p-2 border rounded cursor-pointer" required />

          {/* Image Preview */}
          {preview && <img src={preview} alt="Event Preview" className="w-full h-40 object-cover rounded-md mt-2" />}



        <input type="text" name="title" value={event.title} onChange={handleChange}
          className="w-full p-2 border rounded" placeholder="Enter event title" required />

        <textarea name="description" value={event.description} onChange={handleChange}
          className="w-full p-2 border rounded" placeholder="Enter event description" required />

        <input type="date" name="date" value={event.date} onChange={handleChange}
          className="w-full p-2 border rounded" required />

        <input type="text" name="venue" value={event.venue} onChange={handleChange}
          className="w-full p-2 border rounded" placeholder="Enter venue" required />

        <input type="text" name="registrationLink" value={event.registrationLink} onChange={handleChange}
          className="w-full p-2 border rounded" placeholder="Enter registration link" required />

        <div className="flex justify-between">
          <button type="button" onClick={() => navigate('/events')}
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
  </div>
  );
};

export default EventForm;