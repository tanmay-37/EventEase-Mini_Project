import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { useDebounce } from "react-use";
import { db } from "../../firebase";
import Logout from "../Logout";
import Search from "../Search";
import Spinner from "../Spinner";
import EventCard from "../Card";

const Discover = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to reduce unnecessary filtering
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  // Track search count for an event
  const trackSearch = async (eventId) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, { searchCount: increment(1) });
    } catch (error) {
      console.error("Error tracking search:", error);
    }
  };

  // Fetch all events with real-time updates
  useEffect(() => {
    setLoading(true);
    setErrorMessage("");

    // Modified query to handle cases where searchCount might not exist
    const eventsQuery = query(collection(db, "events"));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const eventsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          searchCount: doc.data().searchCount || 0, // Default to 0 if missing
          ...doc.data(),
        }));

        console.log("Fetched Events:", eventsArray); // Debug log

        if (eventsArray.length === 0) {
          setErrorMessage("No events found.");
        } else {
          setErrorMessage("");
        }

        setAllEvents(eventsArray);
        setFilteredEvents(eventsArray);
        
        // Create trending events by sorting by searchCount
        const trending = [...eventsArray]
          .sort((a, b) => b.searchCount - a.searchCount)
          .slice(0, 5);
        setTrendingEvents(trending);
        
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Error:", error);
        setErrorMessage("Failed to load events. Please try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Filter events based on search term
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredEvents(allEvents);
      setErrorMessage(allEvents.length === 0 ? "No events found." : "");
      return;
    }

    const queryLower = debouncedSearchTerm.toLowerCase();
    const filtered = allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(queryLower) ||
        (event.description && 
         event.description.toLowerCase().includes(queryLower))
    );

    setFilteredEvents(filtered);
    setErrorMessage(filtered.length === 0 ? "No events match your search." : "");
  }, [debouncedSearchTerm, allEvents]);

  return (
    <>
      <div
        className="min-h-screen bg-[#F5F0FF] relative overflow-visible"
        style={{
          backgroundImage: "url('/images/doodad.png')",
          backgroundSize: "500px",
          backgroundPosition: "left",
        }}
      >
        <section className="pt-10 px-5 md:px-20 pb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#4A3F74] mb-6">
              Discover Events
            </h2>

            <div className="max-w-2xl mx-auto">
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>

          {/* Trending Events */}
          {trendingEvents.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Trending Events
              </h2>
              <ul className="flex flex-row overflow-x-auto gap-5 -mt-10 w-full hide-scrollbar">
                {trendingEvents.map((event, index) => (
                  <li
                    key={event.id}
                    className="min-w-[230px] flex flex-row items-center"
                  >
                    <p
                      className="mt-[22px] text-[190px] font-bebas text-transparent relative left-6"
                      style={{
                        WebkitTextStroke: "8px rgba(160, 132, 232, 0.7)",
                        textWrap: "nowrap",
                      }}
                    >
                      {index + 1}
                    </p>
                    <img
                      src={event.image || '/images/event-placeholder.jpg'}
                      alt={event.title}
                      className="w-[170px] h-[200px] rounded-lg object-cover -ml-3.5 z-10"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* All Events Section */}
          <section>
            <h2 className="text-2xl font-bold text-[#4A3F74] mb-6 text-center">
              {debouncedSearchTerm ? "Search Results" : "All Events"}
            </h2>

            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : errorMessage ? (
              <p className="text-center text-[#FF6B6B]">{errorMessage}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="transition-transform duration-300 hover:scale-[1.02]"
                    onClick={() => trackSearch(event.id)}
                  >
                    <EventCard 
                      event={event} 
                      image={event.image || '/images/event-placeholder.jpg'}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </>
  );
};

export default Discover;