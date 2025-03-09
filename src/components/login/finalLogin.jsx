import React, { useState } from "react";
import LoginUser from "./LoginSignUpUser";
import LoginHost from "./LoginSignUpHost";

const LoginContainer = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);

  return (
    <div className="h-screen flex justify-center items-center">
        <div className={`flex justify-center transition-all duration-500 ${isUserLogin ? "" : "flex-row-reverse"}`}>
      {/* Left Side - Active Login Form */}
      <div className=" flex items-center justify-center">
        {isUserLogin ? <LoginUser /> : <LoginHost />}
      </div>

      {/* Right Side - Toggle Section */}
      <div className="p-10 flex flex-col items-center justify-center bg-purple-300">
      Tanmay Talekar
        <button
          onClick={() => setIsUserLogin(!isUserLogin)}
          className="bg-white px-6 py-3 rounded-lg shadow-md text-purple-700 font-semibold hover:bg-gray-200 transition"
        >
          {isUserLogin ? "Login as Host" : "Login as User"}
        </button>
      </div>
    </div>
    </div>
  );
};

export default LoginContainer;
