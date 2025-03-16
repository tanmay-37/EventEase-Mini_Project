import { createContext , useState } from "react";

// context API and state management

export const EventContext = createContext();

// provider
export const EventProvider = ({children}) => {
    const [events , setEvents] = useState([]);
    const [isModalOpen , setIsModalOpen] = useState(false);

    const addEvent = (newEvent) => {
        setEvents([...events , newEvent]);
    };

    return (
        // wrappig into context
        <EventContext.Provider value = {{events , addEvent , isModalOpen , setIsModalOpen}}>
        {children}
        </EventContext.Provider>
    );
};
