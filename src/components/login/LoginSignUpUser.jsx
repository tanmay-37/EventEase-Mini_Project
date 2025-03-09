import React, { useState } from "react";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { FcGoogle } from "react-icons/fc";
import login from "../../styles";
import { motion } from "framer-motion";
import Input from "./Input";

const LoginSignUp = () => {
  const [action, setAction] = useState("SignUp");
  const [userName, setUserName] = useState("");

  const namePrint = (e) => {
    setUserName(e.target.value);
  }

  return (
    <div >
      <div className={`${login.container}`}>
          <div className="flex flex-col justify-center relative">
            <h3 className="font-semibold">User</h3>
            <h1 className="text-2xl font-bold">{action}</h1>
            <img
              src={LoginUnderline}
              alt="underline"
              className="w-16 mt-1 self-center"
            />
          </div>


        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {action === "SignUp" && (
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
              <input type="text" name="userName" placeholder="UserName" onChange={namePrint}  className={`${login.input}`}
              />
            </>
          )}
          <Input type="email" name="email" placeholder="Enter your Email" />
          <Input type="password" name="pwd" placeholder="Password" />
          {action === "SignUp" ? <Input type="password" name="confirmPwd" placeholder="Confirm Password" /> : null}

          {/* Buttons for Login & SignUp */}
          <div className="flex space-x-3 mt-3">
            <button
              type="button"
              className={action === "LogIn" ? login.loginBtnSelected : login.loginBtnNotSelected}
              onClick={() => setAction("LogIn")}
            >
              LogIn
            </button>
            <button
              type="button"
              className={action === "SignUp" ? login.loginBtnSelected : login.loginBtnNotSelected}
              onClick={() => setAction("SignUp")}
            >
              SignUp
            </button>
          </div>

          {action === "SignUp" ? null : <div className="mt-3">
            <a href="#" className="text-[#A084E8] text-sm font-semibold hover:underline">
              Forgot Password?
            </a>
          </div>}
        </form>

        <div className="my-4 border-b border-gray-300 w-full" />

        {/* Google Sign-In Button */}
        <button className="w-full flex items-center justify-center bg-white text-black border border-gray-300 rounded-lg py-2 shadow-md hover:shadow-lg transition">
          <FcGoogle className="text-2xl mr-2" />
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;
