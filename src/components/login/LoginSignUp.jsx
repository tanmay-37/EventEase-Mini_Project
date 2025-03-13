import React, { useState } from "react";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react"; 
import login from "../../styles";
import { motion } from "framer-motion";
import Input from "./Input";
import Button from "./Button";

const LoginSignUp = ({ userType, action, setAction }) => { 
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const namePrint = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className={`${login.container}`}>
      <div className="flex flex-col justify-center relative">
        <h2 className="font-semibold">{userType}</h2>
        <h1 className="text-2xl font-bold">{action}</h1>
        <img src={LoginUnderline} alt="underline" className="w-16 mt-1 self-center" />
      </div>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Show UserName for Host SignUp & User SignUp */}
        {action === "SignUp" && (userType === "User" || userType === "Host") && (
          <>
            {userName.trim() && (
              <motion.h1
                className="text-lg flex justify-center font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Welcome, {userName}
              </motion.h1>
            )}
            <input type="text" name="userName" placeholder="UserName" onChange={namePrint} className={`${login.input}`} />
          </>
        )}

        {/* Email Input (Required for all cases) */}
        <Input type="email" name="email" placeholder="Enter your Email" />

        {/* Password Field (With Show Password Icon) */}
        {(action === "LogIn" || (userType === "User" && action === "SignUp")) && (
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} name="pwd" placeholder="Password" />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        {/* Confirm Password (Only for User SignUp, Without Eye Icon) */}
        {userType === "User" && action === "SignUp" && (
          <Input type="password" name="confirmPwd" placeholder="Confirm Password" />
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-[#A084E8] text-white font-semibold py-2 rounded-lg hover:bg-[#8A6ED1] transition duration-300 shadow-md"
        >
          {action === "SignUp" ? "Create Account" : "Log In"}
        </button>

        {/* Buttons for Login & SignUp */}
        <div className="flex space-x-3 mt-3">
          <Button type="button" userType="LogIn" action={action} setAction={setAction} />
          <Button type="button" userType="SignUp" action={action} setAction={setAction} />
        </div>

        {/* Forgot Password (Only for Login) */}
        {action === "LogIn" && (
          <div className="mt-3">
            <a href="#" className="text-[#A084E8] text-sm font-semibold hover:underline">
              Forgot Password?
            </a>
          </div>
        )}
      </form>

      <div className="my-4 border-b border-gray-300 w-full" />

      {/* Google Sign-In Button */}
      <button className="w-full flex items-center justify-center bg-white text-black border border-gray-300 rounded-lg py-2 shadow-md hover:shadow-lg transition">
        <FcGoogle className="text-2xl mr-2" />
        Sign In with Google
      </button>
    </div>
  );
};

export default LoginSignUp;
