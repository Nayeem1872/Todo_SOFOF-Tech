"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ListTodo, User, Lock, Mail } from "lucide-react";

interface SignupPageProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the access token
        localStorage.setItem("lumina_access_token", data.access_token);
        localStorage.setItem("lumina_username", username);
        onSignup();
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto mt-12 sm:mt-20 p-6 sm:p-8 bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-50"
    >
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex p-3 sm:p-4 bg-indigo-600 rounded-[1.5rem] mb-4 sm:mb-6 shadow-xl shadow-indigo-200">
          <ListTodo size={32} className="text-white sm:w-10 sm:h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
          Join Todo App
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.3em] mt-2">
          Create Your Account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-4">
            Username
          </label>
          <div className="relative">
            <User
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 text-sm sm:text-base focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold placeholder:text-slate-200 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-4">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 text-sm sm:text-base focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold placeholder:text-slate-200 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-4">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 text-sm sm:text-base focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold placeholder:text-slate-200 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] ml-4">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 text-sm sm:text-base focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all font-bold placeholder:text-slate-200 shadow-inner"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg sm:text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-[0.97] mt-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="text-center mt-6 sm:mt-8">
        <p className="text-slate-400 text-xs sm:text-sm font-medium">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 font-black hover:text-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>

      <p className="text-center text-slate-300 text-[10px] sm:text-xs font-medium mt-6 sm:mt-8 italic px-4">
        "Start your journey to productivity."
      </p>
    </motion.div>
  );
}
