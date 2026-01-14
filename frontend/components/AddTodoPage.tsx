"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface AddTodoPageProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoPage({ onAdd }: AddTodoPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-md mx-auto"
    >
      <button
        onClick={() => router.push("/todo")}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-10 group font-bold text-sm"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Tasks
      </button>

      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Draft a Goal
        </h2>
        <p className="text-slate-400 mt-2 font-semibold">
          Break it down, keep it clear.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] px-6">
            Task Title
          </label>
          <input
            autoFocus
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the main focus?"
            className="w-full px-8 py-5 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-xl font-bold placeholder:text-slate-200 shadow-inner"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] px-6">
            Context & Steps
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add some details..."
            className="w-full h-44 px-8 py-6 rounded-[2rem] border-2 border-slate-100 bg-white text-slate-900 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all resize-none text-base font-semibold placeholder:text-slate-200 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="w-full py-5 px-8 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-[0.97] mt-6 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            "Confirm Task"
          )}
        </button>
      </form>
    </motion.div>
  );
}
