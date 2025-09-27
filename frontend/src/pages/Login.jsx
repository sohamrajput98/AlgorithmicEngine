import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import  GradientButton  from "../components/ui/GradientButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-10 rounded-3xl shadow-2xl w-[380px] max-w-full border border-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-center text-purple-400 drop-shadow-lg">
          Login
        </h2>

        {error && (
          <div className="text-red-500 mb-4 text-center font-medium">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-xl bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-600 rounded-xl bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none transition duration-300"
          required
        />

        {/* Metallic animated button */}
        <GradientButton
          type="submit"
            className="w-full px-10 py-3 bg-gradient-to-r from-purple-700 via-purple-900 to-indigo-800 animate-gradient-move"
        >
          Login
        </GradientButton>
      </form>
    </div>
  );
}
