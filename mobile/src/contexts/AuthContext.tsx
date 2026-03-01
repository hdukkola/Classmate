import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getItem, removeItem, setItem } from "@/storage/storage";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token = await getItem("classmate_access_token");
        const storedUser = await getItem("classmate_user");
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        await removeItem("classmate_access_token");
        await removeItem("classmate_user");
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      async login(email, password) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error || !data.session) return { ok: false, error: error?.message ?? "No session returned" };
          await setItem("classmate_access_token", data.session.access_token);
          await setItem("classmate_user", JSON.stringify(data.user));
          setUser(data.user);
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : "Login failed" };
        }
      },
      async signup(name, email, password) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (error) return { ok: false, error: error.message };
          if (data.session && data.user) {
            await setItem("classmate_access_token", data.session.access_token);
            await setItem("classmate_user", JSON.stringify(data.user));
            setUser(data.user);
          }
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : "Signup failed" };
        }
      },
      async logout() {
        try {
          await supabase.auth.signOut();
        } finally {
          await removeItem("classmate_access_token");
          await removeItem("classmate_user");
          setUser(null);
        }
      },
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
