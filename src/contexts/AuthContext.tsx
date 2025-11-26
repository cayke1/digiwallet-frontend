"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User, AuthContextType } from "@/types/auth";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Revalidação no mount
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user } = await api.register({ name, email, password });
      setUser({
        ...user,
        balance: Number(user.balance),
      });
      toast.success("Registro realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await api.login({ email, password });
      setUser({
        ...user,
        balance: Number(user.balance),
      });
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);
      router.push("/login");
      toast.info("Você foi desconectado");
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
