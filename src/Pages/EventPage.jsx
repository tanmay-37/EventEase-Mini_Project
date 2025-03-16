// EventsPage.jsx
import { useContext } from 'react';
// import EventCard from '../../contexts/EventContext';
import { EventContext } from '../contexts/EventContext';

const EventsPage = () => {
  const { events } = useContext(EventContext);

  return (
    <div className="flex flex-wrap justify-center p-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsPage;