import { useContext } from "react";
import {Link} from 'react-router-dom'
import { EventContext } from "../../contexts/EventContext";

const Navbar = () => {
    const {setIsModalOpen} = useContext(EventContext);

    return(
        <nav>
            // root or Home link
            <Link to = '/'>Home</Link>
            
            // events page Link
            <Link to = "/events">View Events</Link>

            // button to create events
            <button onClick={() => setIsModalOpen(true)}>Create Event</button>
        </nav>
    );
}