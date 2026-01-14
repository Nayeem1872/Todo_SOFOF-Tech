"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, ListTodo, Undo2, Redo2, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onLogout: () => void;
  pathname: string;
}

export default function Layout({
  children,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onLogout,
  pathname,
}: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 pb-20">
      <nav className="sticky top-0 z-50 glass-card px-4 py-4 mb-6 border-b border-indigo-100/50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/todo")}
              className="flex items-center gap-3 group outline-none"
              type="button"
            >
              <div className="p-2.5 bg-indigo-600 rounded-2xl group-hover:rotate-6 group-hover:scale-110 transition-all shadow-lg shadow-indigo-200">
                <ListTodo className="text-white w-6 h-6" />
              </div>
              <div className="text-left hidden sm:block">
                <h1 className="font-black text-2xl leading-none text-indigo-950 tracking-tight">
                  Todo App
                </h1>
                <p className="text-[10px] uppercase font-bold text-indigo-400 mt-1 tracking-widest">
                  Tasks & Focus
                </p>
              </div>
            </button>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-all active:scale-90"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={20} />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-all active:scale-90"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pathname !== "/todo/add" && (
              <button
                onClick={() => router.push("/todo/add")}
                className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95 font-bold"
                type="button"
              >
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="hidden sm:inline">New Task</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4">{children}</main>
    </div>
  );
}
