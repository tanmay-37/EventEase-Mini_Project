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
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="group relative inline-flex items-center px-6 py-2 
        bg-[#1E293B] text-[#F1F5F9] font-semibold rounded-xl
        border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
        shadow-[0_0_20px_rgba(56,189,248,0.1)]
        hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]
        transition-all duration-300 hover:scale-105
        backdrop-blur-sm overflow-hidden"
    >
      <span className="relative z-10">Logout</span>
      <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/0 to-[#38BDF8]/0 
        group-hover:from-[#38BDF8]/10 group-hover:to-[#F59E0B]/10 
        transition-all duration-300"></div>
    </button>
  );
};

export default LogoutButton;