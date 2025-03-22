import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSignUp from './components/registration/UserSignUp'
import UserLogin from './components/registration/UserLogin'
import HostSignUp from './components/registration/HostSignUp'
import HostLogin from './components/registration/HostLogin';
import Home from './Pages/Home'
// import EventsPage from './Pages/EventPage';
import Navbar from './components/Navbar/Navbar'
import { EventProvider } from './context/EventContext'
import  EventsHeader  from './components/EventsHeader/EventsHeader'
import EventForm from './components/EventForm/EventForm';
import { AuthContextProvider } from './context/AuthContext';
import Account from './components/registration/Account'


function App() {
  const [count, setCount] = useState(0)

  return (    
  
    <>
    <EventProvider>
      <Router>
        <Navbar />

        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/account" element={<Account />} />
            <Route path="/host-signup" element={<HostSignUp />} />
            <Route path="/host-login" element={<HostLogin />} />

          </Routes>
        </AuthContextProvider>
        
      </Router>

    </EventProvider>
    </>
  )
}

export default App
