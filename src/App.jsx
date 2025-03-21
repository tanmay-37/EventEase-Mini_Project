import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginContainer from './components/login/finalLogin'
import Home from './Pages/Home'
// import EventsPage from './Pages/EventPage';
import Navbar from './components/Navbar/Navbar'
import { EventProvider } from './contexts/EventContext'
import LoginSignUp from './components/login/LoginSignUp';
import  EventsHeader  from './components/EventsHeader/EventsHeader'
import EventForm from './components/EventForm/EventForm';


function App() {
  const [count, setCount] = useState(0)

  return (    
  
    <>
    <EventProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginContainer />} />
        </Routes>

        <div>
        <EventsHeader />
        </div>
      </Router>

    </EventProvider>
    </>
  )
}

export default App
