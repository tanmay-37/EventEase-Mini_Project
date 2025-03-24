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
    <div className="max-w-[600px] mx-auto my-16 p-4 text-center">
      <h1 className="text-3xl font-bold py-4">Account</h1>
      
      {user ? (
        <div className="p-6 border rounded-lg shadow-lg bg-gray-100">
          <p className="text-lg font-semibold text-gray-700">
            <span className="text-gray-900">Email:</span> {user.email}
          </p>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            <span className="text-gray-900">Role:</span>{' '}
            {userType ? (
              <span className={userType === 'User' ? 'text-blue-600' : 'text-green-600'}>
                {userType}
              </span>
            ) : (
              'Loading...'
            )}
          </p>
          <button 
            onClick={handleLogout} 
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-xl text-red-500 font-semibold">No user logged in</p>
      )}
    </div>
  );
};

export default Account;
