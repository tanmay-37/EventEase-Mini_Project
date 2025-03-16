// Navbar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { EventContext } from '../../contexts/EventContext';

const Navbar = () => {
  const { setIsModalOpen } = useContext(EventContext);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/events" className="text-gray-700 hover:text-blue-600">View Events</Link>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </nav>
  );
};

export default Navbar;