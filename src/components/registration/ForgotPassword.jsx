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
  <div className="flex justify-center items-center min-h-screen bg-[#0F172A] p-4">
    <div className="w-full max-w-md p-8 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
      <div className="text-center mb-8">
        <h2 className="text-[#94A3B8] text-lg font-medium">Forgot</h2>
        <h1 className="text-3xl font-bold text-[#F1F5F9] mt-1 relative inline-block">
          Password
          <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full"></div>
        </h1>
      </div>

      {message && (
        <p className="text-[#38BDF8] text-center mb-6 p-4 bg-[#38BDF8]/10 rounded-lg border border-[#38BDF8]/20">
          {message}
        </p>
      )}

      <form onSubmit={handleReset} className="space-y-6">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]
            text-white font-medium rounded-lg
            hover:opacity-90 transition duration-300
            focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-[#38BDF8] hover:text-[#60A5FA] transition duration-300"
        >
          Back to Login
        </Link>
      </div>
    </div>
  </div>
);
};

export default ForgotPassword;