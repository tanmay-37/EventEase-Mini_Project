import { createContext , useState , useContext} from "react";

// context API and state management

// create context
export const EventContext = createContext();

// provider
export const EventProvider = ({children}) => {
    const [events , setEvents] = useState([]);
    

    const addEvent = (newEvent) => {
        setEvents([...events , newEvent]);
    };

    return (
        // wrappig into context
        <EventContext.Provider value = {{events , addEvent}}>
        {children}
        </EventContext.Provider>
    );
};

// hook to use EventsContext
export const useEvents = () => {
    return useContext(EventContext);
};


