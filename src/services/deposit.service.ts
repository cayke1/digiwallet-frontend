import { apiClient, ApiClientError } from "@/lib/api-client";

export interface DepositInput {
  toUserId: string;
  amount: string;
}

export interface DepositResponse {
  transaction: {
    id: string;
    amount: string;
    toUserId: string;
    createdAt: string;
    status: string;
  };
}

export interface DepositServiceResult {
  success: boolean;
  data?: DepositResponse;
  error?: string;
  status?: number;
}

export async function createDeposit(
  input: DepositInput
): Promise<DepositServiceResult> {
  try {
    const data = await apiClient<DepositResponse>("/transactions/deposit", {
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
      error: "Erro inesperado ao processar depósito. Tente novamente.",
      status: 500,
    };
  }
}
