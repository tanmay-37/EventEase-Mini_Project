import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const EventManagement = () => {
  const { user } = UserAuth();
  const navigate = useNavigate(); // Initialize navigation
  const [events, setEvents] = useState([]);
  const [deletedEvent, setDeletedEvent] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
    return () => clearTimeout(undoTimeout);
  }, [user]);

  const handleDelete = async (id) => {
    const eventToDelete = events.find(event => event.id === id);
    if (!eventToDelete) return;

    setEvents(events.filter(event => event.id !== id));
    setDeletedEvent(eventToDelete);

    const timeout = setTimeout(async () => {
      await deleteDoc(doc(db, "events", id));
      setDeletedEvent(null);
    }, 5000);

    setUndoTimeout(timeout);
  };

  const handleUndo = async () => {
    if (!deletedEvent) return;

    await setDoc(doc(db, "events", deletedEvent.id), deletedEvent);
    setEvents(prevEvents => [...prevEvents, deletedEvent]);
    setDeletedEvent(null);
    clearTimeout(undoTimeout);
  };

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

      <ul>
        {events.map(event => (
          <li key={event.id} className="flex justify-between p-2 border-b border-white/40 text-[#4A3F74]">
            <span>{event.title}</span>
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