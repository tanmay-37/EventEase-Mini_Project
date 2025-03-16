import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginContainer from './components/login/finalLogin'
import Home from './Pages/Home'
import EventsPage from './Pages/EventPage';
import Navbar from './components/Navbar/Navbar'
import { EventProvider } from './contexts/EventContext'
import LoginSignUp from './components/login/LoginSignUp';
function App() {
  const [count, setCount] = useState(0)

  return (    
  
    <>
    <EventProvider>
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<LoginContainer />} />
        </Routes>
      </Router>
    </EventProvider>
    </>
  )
}

export default App
