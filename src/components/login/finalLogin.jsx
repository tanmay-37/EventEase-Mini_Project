import React, { useState } from "react";
import Login from "./LoginSignUp";
import TogglingUser from "./TogglingUser";

const LoginContainer = () => {
  const [userType, setUserType] = useState("user");
  const [action, setAction] = useState("SignUp"); 

  return (
    <div className="h-screen flex justify-center items-center">
      <div className={`flex justify-center transition-all duration-500 ${userType === "user" ? "" : "flex-row-reverse"}`}>
        
        {/* Left Side - Active Login Form */}
        <div className="flex items-center justify-center">
          {userType === "user" ? <Login userType="User" action={action} setAction={setAction} /> : <Login userType="Host" action={action} setAction={setAction} />}
        </div>

        {/* Right Side - Toggle Section */}
        <TogglingUser userType={userType} setUserType={setUserType} action={action} />
      </div>
    </div>
  );
};

export default LoginContainer;
