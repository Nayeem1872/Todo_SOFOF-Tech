"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignupPage from "@/components/SignupPage";

export default function Signup() {
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

  const handleSignup = () => {
    router.push("/todo");
  };

  const handleSwitchToLogin = () => {
    router.push("/login");
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-4">
      <SignupPage onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
    </div>
  );
}
