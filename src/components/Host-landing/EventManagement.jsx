import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditEventForm from "../EventForm/EditEventForm";

const EventManagement = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAllEvents = async () => {
      try {
        // Fetch current events with registration counts
        const currentEventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        const currentEventsSnap = await getDocs(currentEventsQuery);
        
        const currentEventsList = await Promise.all(
          currentEventsSnap.docs.map(async (doc) => {
            const registrationsQuery = query(
              collection(db, "registrations"),
              where("eventId", "==", doc.id)
            );
            const registrationsSnap = await getDocs(registrationsQuery);
            
            return {
              id: doc.id,
              ...doc.data(),
              registrationCount: registrationsSnap.size
            };
          })
        );
        setCurrentEvents(currentEventsList);

        // Fetch completed events
        const completedEventsQuery = query(
          collection(db, "recentEvents"),
          where("userId", "==", user.uid)
        );
        const completedEventsSnap = await getDocs(completedEventsQuery);
        
        const completedEventsList = completedEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isCompleted: true
        }));
        setCompletedEvents(completedEventsList);

      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [user]);

  const handleEventUpdate = (updatedEventData) => {
    setCurrentEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...updatedEventData }
          : event
      )
    );
  };

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-md p-6 rounded-xl border border-[#38BDF8]/20 
      shadow-[0_0_20px_rgba(56,189,248,0.2)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#F1F5F9]">Events Hosted</h2>
        <button 
          onClick={() => navigate("/my-created-events")} 
          className="text-[#38BDF8] hover:text-[#F59E0B] font-semibold 
            transition-colors duration-300 flex items-center gap-1 group"
        >
          View All 
          <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </button>
      </div>

      {loading ? (
        <p className="text-[#F1F5F9]/60">Loading...</p>
      ) : currentEvents.length === 0 && completedEvents.length === 0 ? (
        <p className="text-[#F1F5F9]/60">No events created yet</p>
      ) : (
        <div className="space-y-4">
          {/* Current Events */}
          {currentEvents.slice(0, 3).map(event => (
            <div key={event.id} 
              className="p-4 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl border border-[#38BDF8]/20
                hover:border-[#38BDF8]/40 transition-all duration-300
                shadow-[0_0_20px_rgba(56,189,248,0.1)]
                hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F1F5F9]">{event.title}</h3>
                  <span className="text-sm font-medium text-[#F1F5F9]/60">
                    {event.registrationCount || 0} registrations
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="text-[#38BDF8] hover:text-[#F59E0B] font-medium px-3 py-1.5 
                      rounded-lg border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
                      transition-all duration-300"
                  >
                    Edit
                  </button>
                  <span className="text-[#4ADE80] bg-[#4ADE80]/10 px-3 py-1.5 
                    rounded-lg text-sm font-medium border border-[#4ADE80]/20">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Completed Events */}
          {completedEvents.slice(0, Math.max(0, 5 - currentEvents.length)).map(event => (
            <div key={event.id} 
              className="p-4 bg-[#0F172A]/50 backdrop-blur-sm rounded-xl border border-[#38BDF8]/20
                transition-all duration-300
                shadow-[0_0_20px_rgba(56,189,248,0.1)]"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#F1F5F9]">{event.title}</h3>
                  <span className="text-sm font-medium text-[#F1F5F9]/60">
                    {event.registrationCount || 0} registrations
                  </span>
                </div>
                <span className="text-[#F1F5F9]/60 bg-[#F1F5F9]/5 px-3 py-1.5 
                  rounded-lg text-sm font-medium border border-[#F1F5F9]/10">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventForm
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={handleEventUpdate}
        />
      )}
    </div>
  );
};

export default EventManagement;