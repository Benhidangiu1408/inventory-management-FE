"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  userId: string;
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  useEffect(() => {
    setUser(initialUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser?.userId, initialUser?.permissions?.join(",")]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
