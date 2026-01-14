"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-20 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm mx-auto sm:mx-0 ${
        type === "success"
          ? "bg-green-500 text-white"
          : "bg-rose-500 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={20} className="flex-shrink-0" />
      ) : (
        <XCircle size={20} className="flex-shrink-0" />
      )}
      <span className="font-bold text-xs sm:text-sm flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity flex-shrink-0"
      >
        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </motion.div>
  );
}
