"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/LoginPage";

export default function Login() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Redirect if already logged in
    const token = localStorage.getItem("lumina_access_token");
    if (token) {
      router.push("/todo");
    }
  }, [router]);

  const handleLogin = () => {
    router.push("/todo");
  };

  const handleSwitchToSignup = () => {
    router.push("/signup");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4">
      <LoginPage onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
    </div>
  );
}
