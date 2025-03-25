import React, { useState } from "react";
import reg from "../../styles";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { resetPassword } = UserAuth();

const handleReset = async (e) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email.", { position: "top-center", autoClose: 2000 });
    return;
  }

  try {
    console.log("Attempting to send reset email to:", email);
    await resetPassword(email);
    setMessage("Check your email for a password reset link.");
    toast.success("Password reset email sent!", { position: "top-center", autoClose: 2000 });
  } catch (err) {
    console.error("Password Reset Error:", err.code, err.message);
    setMessage(`Error: ${err.message}`);
    toast.error(`Error: ${err.message}`, { position: "bottom-center", autoClose: 2000 });
  }
};


  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`${reg.container} mx-4 md:mx-0`}>
        <div className="flex flex-col justify-center relative">
          <h2 className="font-semibold">Forgot</h2>
          <h1 className="text-2xl font-bold">Password</h1>
          <img src={LoginUnderline} alt="Underline" className="w-16 mt-1 self-center" />
        </div>

        {message && <p className="text-green-500 text-center mt-2">{message}</p>}

        <form className="mt-6 space-y-4 px-2 md:px-0" onSubmit={handleReset}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${reg.input}`}
              required
            />
          </div>
          <button type="submit" className={reg.loginBtnSelected}>
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
