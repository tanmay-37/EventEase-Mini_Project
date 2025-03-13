import React from 'react';

const TogglingUser = ({ userType, setUserType, action }) => {
  return (
    <div className={`p-10 flex flex-col items-center justify-center bg-purple-300 max-w-sm ${userType === "user" ? "rounded-r-2xl" : "rounded-l-2xl"}`}>
      {userType === "user" ? (
            action === "SignUp" ? (
                <div className="text-white flex flex-col justify-center items-center text-center pb-8">
                <h2 className="font-bold text-3xl pb-8">Experience College Like Never Before!</h2>
                <p>Join now to explore and attend college events effortlessly!</p>
                </div>
            ) : (
                <div className="text-white flex flex-col justify-center items-center text-center pb-8">
                <h2 className="font-bold text-3xl pb-8">Welcome Back!</h2>
                <p>Log in to explore and manage college events with ease.</p>
                </div>
            )
            ) : (
            action === "SignUp" ? (
                <div className="text-white flex flex-col justify-center items-center text-center pb-8">
                <h2 className="font-bold text-3xl pb-8">Your One Destination for Seamless Event Hosting!</h2>
                <p>Create, manage, and engage participants effortlessly.</p>
                </div>
            ) : (
                <div className="text-white flex flex-col justify-center items-center text-center pb-8">
                <h2 className="font-bold text-3xl pb-8">Welcome, Host!</h2>
                <p>Log in to streamline your event planning and reach your audience.</p>
                </div>
            )
)}


      
      <button
        onClick={() => setUserType(userType === "user" ? "host" : "user")}
        className="bg-white px-6 py-3 rounded-lg shadow-md text-purple-700 font-semibold hover:bg-gray-200 transition"
      >
        {userType === "user" ? "Login as Host" : "Login as User"}
      </button>
    </div>
  );
};

export default TogglingUser;
