import { apiClient, ApiClientError } from "@/lib/api-client";

export interface TransferInput {
  toUserId: string;
  amount: string;
}

export interface TransferResponse {
  transaction: {
    id: string;
    amount: string;
    fromUserId: string;
    toUserId: string;
    createdAt: string;
    status: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TransferServiceResult {
  success: boolean;
  data?: TransferResponse;
  error?: string;
  status?: number;
}

export interface UserServiceResult {
  success: boolean;
  data?: User;
  error?: string;
  status?: number;
}

export async function getUserByEmail(
  email: string
): Promise<UserServiceResult> {
  try {
    const data = await apiClient<User>(
      `/users/email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        requireAuth: true,
      }
    );

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

export async function transferToUser(
  input: TransferInput
): Promise<TransferServiceResult> {
  try {
    const data = await apiClient<TransferResponse>("/transactions/transfer", {
      method: "POST",
      requireAuth: true,
      idempotencyKey: true,
      body: JSON.stringify({
        toUserId: input.toUserId,
        amount: input.amount,
      }),
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
      error: "Erro inesperado ao processar transferência. Tente novamente.",
      status: 500,
    };
  }
}
