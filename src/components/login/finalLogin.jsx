import React, { useState } from "react";
import Login from "./LoginSignUp";
import TogglingUser from "./TogglingUser";
import { AnimatePresence, motion } from "framer-motion";

const LoginContainer = () => {
  const [userType, setUserType] = useState("user"); // Add state management
  const [action, setAction] = useState("SignUp"); // Add action state

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <motion.div
        layout
        className={`flex flex-col md:flex-row w-full max-w-2xl transition-all duration-500 ${
          userType === "user" ? "" : "md:flex-row-reverse"
        }`}
      >
        {/* Left Side - Login Form */}
        <motion.div layout className="w-full md:w-1/2 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={userType + action}
              initial={{ opacity: 0, x: userType === "user" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: userType === "user" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {userType === "user" ? (
                <Login 
                  userType="User" 
                  action={action} 
                  setAction={setAction} 
                />
              ) : (
                <Login 
                  userType="Host" 
                  action={action} 
                  setAction={setAction} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Side - Toggle Section */}
        <motion.div layout className="md:w-1/2 flex justify-center">
          <TogglingUser 
            userType={userType} 
            setUserType={setUserType} 
            action={action} 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginContainer;