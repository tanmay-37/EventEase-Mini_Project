import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';


const Account = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

useEffect(() => {
  if (userType === "User" && window.location.pathname.includes("host")) {
    navigate("/account");
  }

  if (userType === "Host" && !window.location.pathname.includes("host")) {
    navigate("/account");
  }
}, [userType, navigate]);

    const handleLogout = async () => {
      try {
        await logout();
        navigate('/login');
        console.log('You are logged out');
      } catch (e) {
        console.log(e.message);
      }
    };

    return (
      <div className="max-w-[600px] mx-auto my-16 p-4">
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6 relative inline-block">
          Account Details
          <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full"></div>
        </h2>
        
        {user ? (
          <div className="p-6 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[#94A3B8] text-sm">Email Address</label>
                <p className="text-[#F1F5F9] font-medium">{user.email}</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[#94A3B8] text-sm">Account Type</label>
                {userType ? (
                  <p className={`font-medium ${
                    userType === 'User' 
                      ? 'text-[#38BDF8]' 
                      : 'text-[#60A5FA]'
                  }`}>
                    {userType}
                  </p>
                ) : (
                  <p className="text-[#94A3B8]">Loading...</p>
                )}
              </div>
            </div>
  
            <button 
              onClick={handleLogout} 
              className="mt-8 w-full bg-[#DC2626]/20 hover:bg-[#DC2626]/30 text-[#F1F5F9] 
                border border-[#DC2626]/20 font-medium py-2 px-6 rounded-lg 
                transition duration-300 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="p-6 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
            <p className="text-[#DC2626] text-center">No user logged in</p>
          </div>
        )}
      </div>
    );
};

export default Account;
