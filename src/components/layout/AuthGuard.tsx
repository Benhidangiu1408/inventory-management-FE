"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check for token
    const token = sessionStorage.getItem("token");

    // 2. Define public routes (pages that don't need login)
    const publicPaths = ["/login", "/register", "/forgot-password"];

    // 3. Logic
    if (!token && !publicPaths.includes(pathname)) {
      // Not logged in, trying to access protected page -> Kick to login
      router.push("/login");
    } else if (token && pathname === "/login") {
      // Already logged in, trying to access login -> Send to dashboard
      router.push("/");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
