import { apiClient, ApiClientError } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface UserServiceResult {
  success: boolean;
  data?: User;
  error?: string;
  status?: number;
}

export async function getCurrentUser(): Promise<UserServiceResult> {
  try {
    const data = await apiClient<User>("/users/me", {
      method: "GET",
      requireAuth: true,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        success: false,
        error: error.message,
        status: error.status,
      };
    }

    return {
      success: false,
      error: "Erro inesperado ao buscar usuário. Tente novamente.",
      status: 500,
    };
  }
}
