import React, { useState } from "react";
import reg from "../../styles";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = UserAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    await login(email, password);
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("Unauthorized! Only Users can log in here.");
        await logout();
        return;
      }
    }

    navigate("/account");
  } catch (err) {
    setError(err.message);
    console.log(err.message);
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

        {error && <p className="text-red-500">{error}</p>}

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
          <p className="text-gray-600">New User? 
            <Link to="/signup" className="text-blue-500 hover:underline ml-1">Sign Up</Link>
          </p>
        </div>
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
