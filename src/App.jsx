import {BrowserRouter as Router  ,Routes , Route} from 'react-router-dom';
import { EventProvider } from './contexts/EventContext';
import Navbar from './components/Navbar/Navbar';
import EventPage from './Pages/EventPage';
import EventForm from './components/EventForm/EventForm';
import Home from './Pages/Home';
// import './App.css'




function App() {
  

  return (
     <EventProvider>
      <Router>
      <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* <div className="flex-1">
            <EventForm />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
            </Routes>
          </div> */}
        </div>
      </Router>
     </EventProvider>
 
  )
}

export default App
