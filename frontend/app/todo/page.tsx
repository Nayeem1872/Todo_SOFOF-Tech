"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoApp from "@/components/TodoApp";

export default function TodoPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("lumina_access_token");
    
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isClient || !isAuthenticated) {
    return null;
  }

  return <TodoApp />;
}
