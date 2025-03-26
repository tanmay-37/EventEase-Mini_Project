import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSignUp from './components/registration/UserSignUp'
import UserLogin from './components/registration/UserLogin'
import HostSignUp from './components/registration/HostSignUp'
import HostLogin from './components/registration/HostLogin';
import './firebase.jsx';  // Ensure this import is present
import { auth, db } from './firebase.jsx';  

import { ToastContainer } from "react-toastify";
import Home from './Pages/Home'
// import EventsPage from './Pages/EventPage';
import Navbar from './components/Navbar/Navbar'
import { EventProvider } from './context/EventContext'
import  EventsHeader  from './components/EventsHeader/EventsHeader'
import EventForm from './components/EventForm/EventForm';
import { AuthContextProvider } from './context/AuthContext';
import Account from './components/registration/Account'
import  ProtectedRoute  from './components/registration/ProtectedRoute'
import Layout from './components/Layout/Layout.jsx';
import ForgotPassword from './components/registration/ForgotPassword'
import Discover from './components/User-landing/Discover'
import EventCreation from './components/Host-landing/EventCreation.jsx';
import Dashboard from './components/Host-landing/Dashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (    
  
    <>
    <EventProvider>
      <Router>
        <Navbar />

        <AuthContextProvider>
          <ToastContainer />
          <Routes>

            {/* Group Home + EventsHeader inside Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Home />} />
          </Route>
          


            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/events" element={<EventsHeader/>} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/host-signup" element={<HostSignUp />} />
            <Route path="/host-login" element={<HostLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Protected Routes */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/discover" 
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/event-creation" 
              element={
                <ProtectedRoute>
                  <EventCreation />
                </ProtectedRoute>
              } 
            />

          </Routes>
        </AuthContextProvider>
      </Router>

      

    </EventProvider>
    </>
  )
}

export default App
