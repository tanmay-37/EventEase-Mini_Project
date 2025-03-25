import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GoogleSignInButton = () => {
  const { googleSignIn } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
      toast.success("Google Login Successful!", { position: "top-center", autoClose: 2000 });
      console.log("Logged in User:", user);
      navigate("/account");
    } catch (err) {
      toast.error("Google Login Failed. Try again.", { position: "bottom-center", autoClose: 2000 });
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center bg-white text-black border border-gray-300 rounded-lg py-2 shadow-md hover:shadow-lg transition text-sm md:text-base"
    >
      <FcGoogle className="text-xl md:text-2xl mr-2" />
      Sign In with Google
    </button>
  );
};

export default GoogleSignInButton;
