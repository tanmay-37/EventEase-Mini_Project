import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      console.log('You are logged out');
    } catch (e) {
      console.error('Logout error:', e.message);
      // Optionally, display an error message to the user
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#A084E8] hover:bg-[#8C72D4] text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
    >
      Logout
    </button>
  );
};

export default LogoutButton;