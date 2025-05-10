import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginUnderline from "../../assets/LoginUnderline.png"; 
import { UserAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import reg from "../../styles"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HostLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      const user = auth.currentUser;

      if (user) {
        const hostRef = doc(db, "hosts", user.uid);
        const hostSnap = await getDoc(hostRef);

        if (!hostSnap.exists()) {
          setError("Unauthorized! Only Hosts can log in here.");
            toast.error("Unauthorized! Only Hosts can log in here.", {
                position: "bottom-center",
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
          await logout();
          return;
        }
      }
      toast.success("Login successful!", { position: "top-center", autoClose: 2000 });
      navigate("/host-dashboard");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      toast.error(err.message, {
                position: "bottom-center",
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A] p-4">
      <div className="w-full max-w-md p-8 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-[#94A3B8] text-lg font-medium">Host</h2>
          <h1 className="text-3xl font-bold text-[#F1F5F9] mt-1 relative inline-block">
            Login
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full"></div>
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
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

        {/* Signup and User Login Links */}
        <div className="mt-6 space-y-4">
          <p className="text-center text-[#94A3B8]">
            New Host?{" "}
            <a 
              href="/host-signup" 
              className="text-[#38BDF8] hover:text-[#60A5FA] transition duration-300"
            >
              Sign Up
            </a>
          </p>
          <button 
            onClick={() => navigate("/login")} 
            className="w-full py-2 px-4 bg-[#0F172A]/50 
              text-[#F1F5F9] font-medium rounded-lg
              border border-[#38BDF8]/20
              hover:bg-[#0F172A]/70 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
          >
            Are you a User?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;