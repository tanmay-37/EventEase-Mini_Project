import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, increment } from "firebase/firestore";
import { useDebounce } from "react-use";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from '../Logout';
import Search from '../Search';
import Spinner from '../Spinner';

const Discover = () => {
  const [allEvents, setAllEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const trackSearch = async (eventId) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        searchCount: increment(1)
      });
    } catch (error) {
      console.error("Error tracking search:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setErrorMessage('');
      
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("searchCount", "desc")
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsArray = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAllEvents(eventsArray);
        setFilteredEvents(eventsArray);

        const trending = eventsArray.slice(0, 5);
        setTrendingEvents(trending);
      } catch (error) {
        console.error("Firestore Error:", error);
        setErrorMessage("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Fetch all events from Firestore
      const eventsQuery = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsQuery);

      const eventsArray = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllEvents(eventsArray);
      setFilteredEvents(eventsArray); // Ensure filteredEvents starts with all events

      // Sort and get top 5 trending events
      const trending = [...eventsArray]
        .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
        .slice(0, 5);

      setTrendingEvents(trending);
    } catch (error) {
      console.error("Firestore Error:", error);
      setErrorMessage("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

useEffect(() => {
  if (!debouncedSearchTerm) {
    setFilteredEvents(allEvents);
    setErrorMessage("");
  } else {
    const queryLower = debouncedSearchTerm.toLowerCase();
    const filtered = allEvents.filter(event =>
      event.title.toLowerCase().includes(queryLower) ||
      (event.description && event.description.toLowerCase().includes(queryLower))
    );

    filtered.forEach(event => trackSearch(event.id));

    setFilteredEvents(filtered);

    if (filtered.length === 0) {
      setErrorMessage("No events match your search.");
    } else {
      setErrorMessage("");
    }
  }
}, [debouncedSearchTerm, allEvents]); 





  return (
    <div className="min-h-screen bg-[#F5F0FF] relative overflow-visible"
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

        {trendingEvents.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending Events</h2>
            <ul className="flex flex-row overflow-x-auto gap-5 -mt-10 w-full hide-scrollbar">
              {trendingEvents.map((event, index) => (
                <li key={event.id} className="min-w-[230px] flex flex-row items-center">
                  <p
                    className="mt-[22px] text-[190px] font-bebas text-transparent relative left-6"
                    style={{
                      WebkitTextStroke: "8px rgba(160, 132, 232, 0.7)",
                      textWrap: "nowrap"
                    }}
                  >
                    {index + 1}
                  </p>
                  <img
                    src={event.image}
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
            {debouncedSearchTerm ? 'Search Results' : 'All Events'}
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
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
      <Logout />
    </div>
  );
};

export default Discover;