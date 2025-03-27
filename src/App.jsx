import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserSignUp from './components/registration/UserSignUp';
import UserLogin from './components/registration/UserLogin';
import HostSignUp from './components/registration/HostSignUp';
import HostLogin from './components/registration/HostLogin';
import './firebase.jsx';  
import { ToastContainer } from "react-toastify";
import Home from './Pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from "./components/Footer/Footer.jsx";
import DevelopedByTeam from "./components/Footer/DevelopedByTeam.jsx";
import { EventProvider } from './context/EventContext';
import EventsHeader from './components/EventsHeader/EventsHeader';
import EventForm from './components/EventForm/EventForm';
import { AuthContextProvider } from './context/AuthContext';
import Account from './components/registration/Account';
import ProtectedRoute from './components/registration/ProtectedRoute';
import Layout from './components/Layout/Layout.jsx';
import EventDetails from './components/EventDetails/EventDetails.jsx';
import EventRegistration from './components/EventRegistration/EventRegistration.jsx';
import ForgotPassword from './components/registration/ForgotPassword';

function App() {
  return (    
    <EventProvider>
      <Router>
        <Navbar />
        <AuthContextProvider>
          <ToastContainer />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Home />} />
            </Route>
            <Route path="/events" element={<EventsHeader/>} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/host-signup" element={<HostSignUp />} />
            <Route path="/host-login" element={<HostLogin />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/event/:id/register" element={<EventRegistration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route path="/developed-by-team" element={<DevelopedByTeam />} />  {/* New route for team page */}
          </Routes>
        </AuthContextProvider>
        <Footer />
      </Router>
    </EventProvider>
  );
}

export default App;
