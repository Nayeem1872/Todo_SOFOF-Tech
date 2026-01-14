"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

export default function DeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-rose-100 rounded-2xl mb-6">
              <AlertTriangle className="text-rose-500" size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              Delete Task?
            </h3>
            <p className="text-slate-500 font-semibold mb-2">
              Are you sure you want to delete:
            </p>
            <p className="text-slate-900 font-bold mb-8 line-clamp-2">
              "{title}"
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={onCancel}
                className="flex-1 py-4 px-6 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-4 px-6 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
