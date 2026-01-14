"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  CheckCircle,
  GripVertical,
  Trash2,
  Clock,
  PlayCircle,
  CheckCircle2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Todo, TodoStatus, FilterType } from "@/types";
import DeleteModal from "./DeleteModal";

interface TodoListPageProps {
  todos: Todo[];
  onStatusCycle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onReorder: (newTodos: Todo[]) => void;
}

const StatusBadge: React.FC<{
  status: TodoStatus;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ status, onClick }) => {
  const configs = {
    [TodoStatus.PENDING]: {
      icon: Clock,
      color: "bg-slate-100 text-slate-600 border-slate-200",
      label: "Pending",
    },
    [TodoStatus.IN_PROGRESS]: {
      icon: PlayCircle,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      label: "In Progress",
    },
    [TodoStatus.DONE]: {
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "Done",
    },
  };
  const { icon: Icon, color, label } = configs[status];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${color} transition-all active:scale-95 hover:brightness-95 shadow-sm`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
};

export default function TodoListPage({
  todos,
  onStatusCycle,
  onDelete,
  onUpdateTitle,
  onReorder,
}: TodoListPageProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; todo: Todo | null }>({
    isOpen: false,
    todo: null,
  });
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (todo: Todo) => {
    setDeleteModal({ isOpen: true, todo });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.todo) {
      onDelete(deleteModal.todo.id);
    }
    setDeleteModal({ isOpen: false, todo: null });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, todo: null });
  };

  const filteredTodos = useMemo(() => {
    if (filter === "all") return todos;
    return todos.filter((t) => t.status === filter);
  }, [todos, filter]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      done: todos.filter((t) => t.status === TodoStatus.DONE).length,
      pending: todos.filter((t) => t.status === TodoStatus.PENDING).length,
      progress: todos.filter((t) => t.status === TodoStatus.IN_PROGRESS).length,
    };
  }, [todos]);

  const handleStartEdit = (todo: Todo) => {
    if (todo.status === TodoStatus.DONE) return;
    setEditingId(todo.id);
    setTempText(todo.title);
  };

  const handleSaveEdit = () => {
    if (editingId && tempText.trim() && tempText.trim() !== todos.find(t => t.id === editingId)?.title) {
      onUpdateTitle(editingId, tempText.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempText("");
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  return (
    <>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title={deleteModal.todo?.title || ""}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "All", count: stats.total },
          { label: "Wait", count: stats.pending },
          { label: "Run", count: stats.progress },
          { label: "End", count: stats.done },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm text-center"
          >
            <p className="text-xl sm:text-2xl font-black text-slate-800">{item.count}</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {(
          [
            "all",
            TodoStatus.PENDING,
            TodoStatus.IN_PROGRESS,
            TodoStatus.DONE,
          ] as FilterType[]
        ).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${
              filter === f
                ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100"
                : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
            }`}
          >
            {f === "all" ? "All Tasks" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 sm:py-32 text-center px-4"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-slate-100">
              <CheckCircle size={32} className="text-slate-100 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Peace of mind.
            </h3>
            <p className="text-sm sm:text-base text-slate-400 font-medium mt-2">
              No tasks found in this category.
            </p>
          </motion.div>
        ) : (
          <Reorder.Group
            axis="y"
            values={todos}
            onReorder={onReorder}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <Reorder.Item
                  key={todo.id}
                  value={todo}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`group bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative flex items-start gap-3 sm:gap-5 ${
                    todo.status === TodoStatus.DONE
                      ? "bg-slate-50/50 opacity-70"
                      : ""
                  }`}
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-200 group-hover:text-slate-400 mt-1 sm:mt-2 transition-colors hidden sm:block">
                    <GripVertical size={24} />
                  </div>

                  <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              ref={editInputRef}
                              className="flex-1 text-base sm:text-xl font-black text-indigo-900 bg-transparent border-b-2 border-indigo-500 outline-none pb-1"
                              value={tempText}
                              onChange={(e) => setTempText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit();
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all flex-shrink-0"
                              title="Save"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all flex-shrink-0"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <h3
                              className={`flex-1 text-base sm:text-xl font-black text-slate-900 leading-tight tracking-tight break-words ${
                                todo.status === TodoStatus.DONE
                                  ? "line-through text-slate-400"
                                  : ""
                              }`}
                            >
                              {todo.title}
                            </h3>
                            {todo.status !== TodoStatus.DONE && (
                              <button
                                onClick={() => handleStartEdit(todo)}
                                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex-shrink-0"
                                title="Edit task"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <StatusBadge
                        status={todo.status}
                        onClick={() => onStatusCycle(todo.id)}
                      />
                    </div>

                    {todo.description && (
                      <p
                        className={`text-xs sm:text-sm font-medium leading-relaxed ${
                          todo.status === TodoStatus.DONE
                            ? "text-slate-300"
                            : "text-slate-500"
                        } line-clamp-3 break-words`}
                      >
                        {todo.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteClick(todo)}
                    className="p-2 sm:p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl sm:rounded-2xl transition-all flex-shrink-0"
                    title="Delete task"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>
    </motion.div>
    </>
  );
}
