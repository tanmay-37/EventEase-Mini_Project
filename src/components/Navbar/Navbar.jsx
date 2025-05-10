import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";  
import logo from "../../assets/logo.png";
import userLogo from "../../assets/Userlogo.webp";
import { EventContext } from "../../context/EventContext";
import { UserAuth } from "../../context/AuthContext";

const Navbar = () => {
  const eventContext = useContext(EventContext);
  const { user, userType, logout } = UserAuth();
  const isHost = userType === "host";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  if (!eventContext) {
    console.error("Navbar must be used within an EventProvider");
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes dropIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
      <div className="h-16">
        <nav className="bg-background/95 backdrop-blur-sm border-b border-primary/20 fixed w-full top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Hamburger Menu (Mobile) */}
              <button
                className="md:hidden text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
                onClick={() => setIsMenuOpen(true)}
                aria-expanded={isMenuOpen}
              >
                <Menu size={24} />
              </button>
  
              {/* Center: Logo */}
              <div className="flex-shrink-0">
                <Link to="/">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-10 w-auto transition-transform hover:scale-105" 
                  />
                </Link>
              </div>
  
              {/* Middle: Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8 overflow-visible">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/discover">View Events</NavLink>
            </div>
  
              {/* Right: Profile Section */}
              <div className="relative flex items-center" ref={profileRef}>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center space-x-3 group focus:outline-none rounded-full 
                        bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-md 
                        hover:from-background-light/70 hover:to-background-light/40 p-2 
                        shadow-glow-primary border border-primary/20 transition-all duration-300"
                    >
                      <img 
                        src={userLogo} 
                        alt="User Logo" 
                        className="w-9 h-9 rounded-full border-2 border-transparent 
                          group-hover:border-primary transition-all duration-300
                          shadow-glow-primary" 
                      />
                      <span className="text-text hidden md:block font-medium 
                        group-hover:text-primary transition-colors pr-2">
                        {user.displayName || "User"}
                      </span>
                    </button>
                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                      <div 
                        className="absolute right-0 mt-3 w-52 rounded-xl overflow-hidden
                          bg-[#1E293B]/95 backdrop-blur-md
                          shadow-[0_8px_32px_rgba(56,189,248,0.2)]
                          border border-[#38BDF8]/30
                          transform origin-top-right
                          animate-[dropIn_0.2s_ease-out]"
                      >
                        <div className="py-2 divide-y divide-[#38BDF8]/20">
                          <DropdownLink 
                            to={isHost ? "/host-dashboard" : "/user-dashboard"}
                            onClick={() => setProfileMenuOpen(false)}
                            className="block w-full px-4 py-2.5 text-sm text-[#F1F5F9]
                              hover:bg-[#38BDF8]/20 hover:text-[#38BDF8]
                              transition-all duration-200"
                          >
                            Dashboard
                          </DropdownLink>
                          <DropdownLink 
                            to="/my-profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="block w-full px-4 py-2.5 text-sm text-[#F1F5F9]
                              hover:bg-[#38BDF8]/20 hover:text-[#38BDF8]
                              transition-all duration-200"
                          >
                            View Profile
                          </DropdownLink>
                          <button
                            onClick={() => {
                              logout();
                              setProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#F1F5F9]
                              hover:bg-[#38BDF8]/20 hover:text-[#38BDF8]
                              transition-all duration-200"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-5 py-2.5 
                      bg-gradient-to-r from-accent to-accent-dark
                      hover:from-accent-dark hover:to-accent
                      text-background text-sm font-medium rounded-xl
                      shadow-glow-accent hover:shadow-glow-accent
                      hover:scale-[1.02] border border-accent/30
                      transition-all duration-300"
                  >
                    Login/SignUp
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
  
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm transition-opacity z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
  
      {/* Mobile Sidebar */}
      <div
  className={`fixed top-0 left-0 h-full w-72 bg-[#1E293B]/95 backdrop-blur-md transform ${
    isMenuOpen ? "translate-x-0" : "-translate-x-full"
  } transition-transform duration-300 ease-out z-50`}
>
  <div className="flex items-center justify-between p-4 border-b border-[#38BDF8]/20">
    <Link to="/" className="flex-shrink-0">
      <img 
        src={logo} 
        alt="Logo" 
        className="h-8 w-auto" 
      />
    </Link>
    <button 
      onClick={() => setIsMenuOpen(false)}
      className="p-2 rounded-md text-[#F1F5F9] hover:text-[#38BDF8] 
        hover:bg-[#38BDF8]/10 focus:outline-none focus:ring-2 
        focus:ring-[#38BDF8]/50 transition-all duration-200"
    >
      <X size={24} />
    </button>
  </div>

  <div className="flex flex-col py-4">
    <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
      Home
    </MobileNavLink>
    <MobileNavLink to="/discover" onClick={() => setIsMenuOpen(false)}>
      View Events
    </MobileNavLink>
  </div>
</div>
    </>
  );
};

// Helper Components
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="group relative px-3 py-2 text-sm font-medium text-text hover:text-primary transition-colors duration-300"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-[width] duration-300 ease-in-out group-hover:w-full"></span>
  </Link>
);

const DropdownLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block w-full px-4 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary transition-colors duration-150"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-6 py-3 text-text hover:bg-primary/10 hover:text-primary transition-colors duration-150"
  >
    {children}
  </Link>
);

export default Navbar;