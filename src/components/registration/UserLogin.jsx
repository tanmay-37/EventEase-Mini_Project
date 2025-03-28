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
    <div className="flex justify-center items-center h-screen">
      <div className={`${reg.container} mx-4 md:mx-0`}>
        <div className="flex flex-col justify-center relative">
          <h2 className="font-semibold">User</h2>
          <h1 className="text-2xl font-bold">Login</h1>
          <img src={LoginUnderline} alt="Underline" className="w-16 mt-1 self-center" />
        </div>

        <form className="mt-6 space-y-4 px-2 md:px-0" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${reg.input}`}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${reg.input}`}
            />
          </div>
          <button type="submit" className={reg.loginBtnSelected}>
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="m-4 text-center">
          <p className="text-gray-600">
            New User?
            <Link to="/signup" className="text-blue-500 hover:underline ml-1">Sign Up</Link>
          </p>
        </div>

        <GoogleSignInButton />


        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate("/host-login")} 
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Are you a host?
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;