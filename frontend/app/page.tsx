"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("lumina_access_token");
    if (token) {
      router.push("/todo");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
