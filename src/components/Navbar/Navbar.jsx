import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";  
import logo from "../../assets/logo.png";
import { EventContext } from "../../context/EventContext";
import { UserAuth } from "../../context/AuthContext";

const Navbar = () => {
  const eventContext = useContext(EventContext);
  const { user, userType, logout } = UserAuth();
  const isHost = userType === "host";

  if (!eventContext) {
    console.error("Navbar must be used within an EventProvider");
    return null;
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#F5FEFD] shadow-md p-4 flex items-center justify-between w-full sticky top-0 z-40">
        {/* Left: Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(true)}
          aria-expanded={isMenuOpen}
        >
          <Menu size={28} />
        </button>

        {/* Center: Logo */}
        <div className="md:static md:w-auto w-full flex justify-center md:justify-start">
          <img src={logo} id="logo" alt="Logo" className="w-20" />
        </div>

        {/* Middle: Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 text-lg hover:text-purple-600">
            Home
          </Link>
          <Link to="/discover" className="text-gray-700 text-lg hover:text-purple-600">
            View Events
          </Link>
        </div>

        {/* Right: Profile Section */}
        <div className="relative" ref={profileRef}>
          {user ? (
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img src="src/assets/Userlogo.webp" alt="User Logo" className="w-12 h-12 rounded-full" />
              <span className="text-gray-700 hidden md:inline">{user.displayName || "User"}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 border border-gray-400 rounded px-4 py-2 transition hover:text-white hover:bg-gradient-to-r from-purple-500 to-purple-700"
            >
              Login/SignUp
            </Link>
          )}

          {/* Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-40">
              <Link
                to={isHost ? "/host-dashboard" : "/user-dashboard"}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link to="/my-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                View Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay (Closes menu when clicked) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-opacity-20 z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Sidebar Menu for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#F5FEFD] shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={28} className="text-gray-700" />
          </button>
        </div>

        {/* Sidebar Links (Mobile) */}
        <div className="flex flex-col items-start space-y-6 px-6">
          <Link to="/" className="text-gray-700 text-lg hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/discover" className="text-gray-700 text-lg hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>
            View Events
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
