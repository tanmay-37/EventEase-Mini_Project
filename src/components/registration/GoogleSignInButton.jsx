import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleSignIn } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const user = await googleSignIn();
      if (user) {
        toast.success("Successfully signed in with Google!");
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-3
        bg-[#1E293B]/80 backdrop-blur-md 
        text-[#F1F5F9] font-medium
        border border-[#38BDF8]/20 rounded-lg
        py-3 px-4
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1E293B]/90'}
        focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
        transform transition-all duration-300 hover:scale-[1.02]
        shadow-lg shadow-[#38BDF8]/10`}
    >
      {isLoading ? (
        <span>Signing in...</span>
      ) : (
        <>
          <FcGoogle className="text-2xl" />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton;