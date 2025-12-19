import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const adminUser = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPass = import.meta.env.VITE_ADMIN_PASS;

    if (username === adminUser && password === adminPass) {
      localStorage.setItem("status", "loggedin");
      navigate("/");
    } else {
      setError("Invalid admin credentials");
    }
  };
  useEffect(() => {
  if (localStorage.getItem("status") === "loggedin") {
    navigate("/");
  }
}, []);

  return (
    <div className="min-h-screen flex items-start justify-center bg-green-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="logo flex w-full justify-center">
            <img src={Logo} alt="Logo" className="w-18 h-18" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
