import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for the hamburger menu
import logo from "../../assets/logo.png";
import { EventContext } from "../../context/EventContext";
import {UserAuth} from "../../context/AuthContext"
import Logout from "../Logout"

const Navbar = () => {
  // Get the EventContext value
  const eventContext = useContext(EventContext);
  const {user, userType} = UserAuth();
  const isHost = userType === "host";

  if (!eventContext) {
    console.error("Navbar must be used within an EventProvider");
    return null;
  }

  const { setIsModalOpen } = eventContext;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#F5FEFD] shadow-md p-4 flex  space-x-10 w-full items-center sticky top-0 z-40">
        {/* Logo */}
        <img src={logo} id="logo" alt="Logo" className="w-20" />

        {/* Desktop Nav Links (Hidden on small screens) */}
        <div className="hidden md:flex space-x-6 lg:space-x-10 items-center justify-end w-full">
          
          <Link to="/" className="text-gray-700 transition duration-300 ease-in-out hover:text-purple-600">
            Home
          </Link>
          {isHost ? null : 
          <Link to="/discover" className="text-gray-700 transition duration-300 ease-in-out hover:text-purple-600">
            View Events
          </Link>}
          {!isHost ? 
          <Link
            to="/user-dashboard"
            className="text-gray-700 border border-gray-400 rounded px-4 py-2 transition duration-300 ease-in-out hover:text-white hover:bg-gradient-to-r from-purple-500 to-purple-700"
          >
            Dashboard
          </Link> : 
          <Link
            to="/host-dashboard"
            className="text-gray-700 border border-gray-400 rounded px-4 py-2 transition duration-300 ease-in-out hover:text-white hover:bg-gradient-to-r from-purple-500 to-purple-700"
          >
            Dashboard
          </Link>}
          {user ? <Logout /> : 
          <Link
            to="/login"
            className="text-gray-700 border border-gray-400 rounded px-4 py-2 transition duration-300 ease-in-out hover:text-white hover:bg-gradient-to-r from-purple-500 to-purple-700"
          >
            Login/SignUp
          </Link>}
        </div>

        {/* Hamburger Menu Button (Visible on small screens) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none ml-auto"
          onClick={() => setIsMenuOpen(true)}
          aria-expanded={isMenuOpen}
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu (Opens from the right) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#F5FEFD] shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={28} className="text-gray-700" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start space-y-6 px-6">
          <Link
            to="/"
            className="text-gray-700 text-lg hover:text-purple-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/discover"
            className="text-gray-700 text-lg hover:text-purple-600"
            onClick={() => setIsMenuOpen(false)}
          >
            View Events
          </Link>
          {user ? <Logout /> : 
          <Link
            to="/login"
            className="text-gray-700 border border-gray-400 rounded px-4 py-2 transition duration-300 ease-in-out hover:text-white hover:bg-gradient-to-r from-purple-500 to-purple-700"
          >
            Login/SignUp
          </Link>}
          
        </div>
      </div>
    </>
  );
};

export default Navbar;
