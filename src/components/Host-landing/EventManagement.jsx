import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; 

const EventManagement = () => {
  const { user } = UserAuth();
  const navigate = useNavigate(); 
  const [events, setEvents] = useState([]);
  const [deletedEvent, setDeletedEvent] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        // Fetch events
        const eventsQuery = query(collection(db, "events"), where("userId", "==", user.uid));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        // Get registration counts for each event
        const eventsWithRegistrations = await Promise.all(
          eventsSnapshot.docs.map(async (eventDoc) => {
            const registrationsQuery = query(
              collection(db, "registrations"),
              where("eventId", "==", eventDoc.id)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            
            return {
              id: eventDoc.id,
              ...eventDoc.data(),
              registrationCount: registrationsSnapshot.size
            };
          })
        );

        setEvents(eventsWithRegistrations);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    return () => clearTimeout(undoTimeout);
  }, [user]);

  // ...existing handleDelete and handleUndo functions...

  return (
    <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4A3F74]">Events Hosted</h2>
        <button 
          onClick={() => navigate("/my-created-events")} 
          className="bg-[#A084E8] hover:bg-[#8C72D4] text-white px-4 py-2 rounded-lg transition"
        >
          Explore Your Events
        </button>
      </div>

      <ul className="space-y-2">
        {events.map(event => (
          <li key={event.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg border-b border-white/40">
            <div className="flex flex-col">
              <span className="font-medium text-[#4A3F74]">{event.title}</span>
              <span className="text-sm text-purple-600">
                {event.registrationCount || 0} {event.registrationCount === 1 ? 'Registration' : 'Registrations'}
              </span>
            </div>
            <button 
              onClick={() => handleDelete(event.id)} 
              className="bg-[#A084E8] hover:bg-[#8C72D4] text-white px-4 py-2 rounded-lg transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {deletedEvent && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg flex justify-between">
          <p>Event "{deletedEvent.title}" deleted!</p>
          <button 
            onClick={handleUndo} 
            className="text-blue-500 font-semibold"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default EventManagement;