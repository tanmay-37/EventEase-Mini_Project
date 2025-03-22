import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginUnderline from "../../assets/LoginUnderline.png"; // ✅ Underline Image
import { UserAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import reg from "../../styles"; // ✅ Import shared styles
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

        toast.success("Login successfull!", {
            position: "top-center",
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });

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

      navigate("/account");
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
    <div className="flex justify-center items-center h-screen">
      <div className={`${reg.container} mx-4 md:mx-0`}>
        {/* Header Section */}
        <div className="flex flex-col justify-center relative text-center">
          <h2 className="font-semibold">Host</h2>
          <h1 className="text-2xl font-bold">Login</h1>
          <img src={LoginUnderline} alt="Underline" className="w-16 mt-1 self-center" />
        </div>


        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4 px-2 md:px-0">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${reg.input}`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${reg.input}`}
          />
          <button type="submit" className={reg.loginBtnSelected}>
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New Host? 
            <a href="/host-signup" className="text-blue-500 hover:underline ml-1">
              Sign Up
            </a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate("/login")} 
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            Are you a User?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;
