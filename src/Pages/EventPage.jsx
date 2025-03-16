import {useContext} from 'react'
import EventCard from '../components/EventCard/EventCard'
import { EventContext } from '../contexts/EventContext'

// event page creation

const Eventpage = () => {
    const {events} = useContext(EventContext)

    return (
        <div className='events-container'>
            {events.map((event) => (
                <EventCard key = {event.id} event = {event}/>
            ))}
        </div>
    );
};

export default Eventpage;