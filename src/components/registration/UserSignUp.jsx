import React, { useState } from "react";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { Link, useNavigate } from "react-router-dom";
import reg from "../../styles";
import { UserAuth } from "../../context/AuthContext";
import Input from "./Input";
import Button from "./Button";

const UserSignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPwd, setCnfPwd] = useState("");
  const [error, setError] = useState("");

  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== cnfPwd) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUser(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`${reg.container} mx-4 md:mx-0`}> 
        <div className="flex flex-col justify-center relative text-center">
          <h2 className="font-semibold">User</h2>
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <img src={LoginUnderline} alt="Underline" className="w-16 mt-1 self-center" />
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4 px-2 md:px-0" onSubmit={handleSubmit}>
          <Input type="text" name="userName" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <Input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input type="password" name="cnfPwd" placeholder="Confirm Password" value={cnfPwd} onChange={(e) => setCnfPwd(e.target.value)} />
          <Button action="Sign Up" />
        </form>

        {/* Already a user? Login Button */}
        <div className="mt-4 text-center">
                  <p className="text-gray-600">New User? 
                    <Link to="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
                  </p>
                </div>
      </div>
    </div>
  );
};

export default UserSignUp;