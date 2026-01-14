"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/todo/add");
  }, [router]);

  return null;
}
