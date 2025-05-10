import React, { useState } from "react";
import reg from "../../styles";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore"; 
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSignInButton from "./GoogleSignInButton";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login, googleSignIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      const user = auth.currentUser;

            if (user) {
        // Check if the user exists in the 'hosts' collection
        const hostRef = doc(db, "hosts", user.uid);
        const hostSnap = await getDoc(hostRef);

        if (hostSnap.exists()) {
          // If the user is a host, prevent login as a user
          setError("Hosts cannot log in as users.");
          toast.error("Hosts cannot log in as users.", {
            position: "bottom-center",
            autoClose: 2000,
          });
          // await logout();
          return;
        }
      }

      toast.success("Login successful!", { position: "top-center", autoClose: 2000 });
      navigate("/user-dashboard");
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: "bottom-center", autoClose: 2000 });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A] p-4">
      <div className="w-full max-w-md p-8 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-[#94A3B8] text-lg font-medium">User</h2>
          <h1 className="text-3xl font-bold text-[#F1F5F9] mt-1 relative inline-block">
            Login
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full"></div>
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]
              text-white font-medium rounded-lg
              hover:opacity-90 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link 
            to="/forgot-password"
            className="text-[#38BDF8] hover:text-[#60A5FA] transition duration-300"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-[#94A3B8]">
            New User?{" "}
            <Link 
              to="/signup"
              className="text-[#38BDF8] hover:text-[#60A5FA] transition duration-300"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Google Sign In */}
        <div className="my-6">
          <GoogleSignInButton />
        </div>

        {/* Host Login Button */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate("/host-login")} 
            className="w-full py-2 px-4 bg-[#0F172A]/50 
              text-[#F1F5F9] font-medium rounded-lg
              border border-[#38BDF8]/20
              hover:bg-[#0F172A]/70 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
          >
            Are you a Host?
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;