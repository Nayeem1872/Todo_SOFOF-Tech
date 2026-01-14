"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Todo, TodoStatus } from "@/types";
import Layout from "./Layout";
import TodoListPage from "./TodoListPage";
import AddTodoPage from "./AddTodoPage";
import Toast, { ToastType } from "./Toast";

export default function TodoApp() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // History management
  const [history, setHistory] = useState<Todo[][]>([[]]);
  const [historyPointer, setHistoryPointer] = useState(0);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem("lumina_access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/todos", {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedTodos: Todo[] = data.map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description || "",
          status: todo.status as TodoStatus,
          createdAt: new Date(todo.createdAt).getTime() || Date.now(),
        }));
        setTodos(formattedTodos);
        setHistory([formattedTodos]);
        setHistoryPointer(0);
      } else if (response.status === 401) {
        localStorage.removeItem("lumina_access_token");
        router.push("/login");
      }
    } catch (error) {
      console.error("Fetch todos error:", error);
      showToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
    fetchTodos();
  }, [fetchTodos]);

  // Persistence (optional - keep local backup)
  useEffect(() => {
    if (isClient && todos.length > 0) {
      localStorage.setItem("lumina_v3_todos", JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const updateStateAndHistory = useCallback(
    (newTodos: Todo[]) => {
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push(newTodos);

      // Limit history to 50 steps
      if (newHistory.length > 50) newHistory.shift();

      setHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      setTodos(newTodos);
    },
    [history, historyPointer]
  );

  const handleUndo = useCallback(() => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      setHistoryPointer(prevPointer);
      setTodos(history[prevPointer]);
    }
  }, [history, historyPointer]);

  const handleRedo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      const nextPointer = historyPointer + 1;
      setHistoryPointer(nextPointer);
      setTodos(history[nextPointer]);
    }
  }, [history, historyPointer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isZ = e.key.toLowerCase() === "z";
      const isY = e.key.toLowerCase() === "y";
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && isZ) {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if (isMod && isY) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleAddTodo = async (title: string, description: string) => {
    const token = localStorage.getItem("lumina_access_token");
    
    if (!token) {
      showToast("Please login again", "error");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status: "PENDING",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const newTodo: Todo = {
          id: data.id || crypto.randomUUID(),
          title,
          description,
          status: TodoStatus.PENDING,
          createdAt: Date.now(),
        };
        
        updateStateAndHistory([newTodo, ...todos]);
        showToast("Task added successfully!", "success");
        router.push("/todo");
      } else if (response.status === 401) {
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("lumina_access_token");
        router.push("/login");
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to add task", "error");
      }
    } catch (error) {
      console.error("Add todo error:", error);
      showToast("Failed to connect to server", "error");
    }
  };

  const handleStatusCycle = async (id: string) => {
    const token = localStorage.getItem("lumina_access_token");
    const todo = todos.find((t) => t.id === id);
    
    if (!todo || !token) return;

    const order = [TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.DONE];
    const nextIndex = (order.indexOf(todo.status) + 1) % order.length;
    const newStatus = order[nextIndex];

    // Optimistic update
    const newTodos = todos.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    updateStateAndHistory(newTodos);

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          status: newStatus,
        }),
      });

      if (response.ok) {
        showToast("Status updated!", "success");
      } else if (response.status === 401) {
        showToast("Session expired", "error");
        router.push("/login");
      } else {
        // Revert on error
        updateStateAndHistory(todos);
        showToast("Failed to update status", "error");
      }
    } catch (error) {
      console.error("Update status error:", error);
      updateStateAndHistory(todos);
      showToast("Failed to connect to server", "error");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const token = localStorage.getItem("lumina_access_token");
    
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newTodos = todos.filter((todo) => todo.id !== id);
        updateStateAndHistory(newTodos);
        showToast("Task deleted successfully!", "success");
      } else if (response.status === 401) {
        showToast("Session expired", "error");
        router.push("/login");
      } else {
        showToast("Failed to delete task", "error");
      }
    } catch (error) {
      console.error("Delete todo error:", error);
      showToast("Failed to connect to server", "error");
    }
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    const token = localStorage.getItem("lumina_access_token");
    const todo = todos.find((t) => t.id === id);
    
    if (!todo || !token) return;

    // Optimistic update
    const newTodos = todos.map((t) =>
      t.id === id ? { ...t, title } : t
    );
    updateStateAndHistory(newTodos);

    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: todo.description,
          status: todo.status,
        }),
      });

      if (response.ok) {
        showToast("Task updated!", "success");
      } else if (response.status === 401) {
        showToast("Session expired", "error");
        router.push("/login");
      } else {
        // Revert on error
        updateStateAndHistory(todos);
        showToast("Failed to update task", "error");
      }
    } catch (error) {
      console.error("Update title error:", error);
      updateStateAndHistory(todos);
      showToast("Failed to connect to server", "error");
    }
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("lumina_access_token");
    localStorage.removeItem("lumina_username");
    localStorage.removeItem("lumina_auth");
    router.push("/login");
  };

  if (!isClient || isLoading) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      
      <Layout
        canUndo={historyPointer > 0}
        canRedo={historyPointer < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onLogout={handleLogout}
        pathname={pathname}
      >
        <AnimatePresence mode="wait">
          {pathname === "/todo/add" ? (
            <AddTodoPage onAdd={handleAddTodo} />
          ) : (
            <TodoListPage
              todos={todos}
              onStatusCycle={handleStatusCycle}
              onDelete={handleDeleteTodo}
              onUpdateTitle={handleUpdateTitle}
              onReorder={setTodos}
            />
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}
