import { apiClient, ApiClientError } from "@/lib/api-client";

export interface ReversalInput {
  relatedTransactionId: string;
  description?: string;
}

export interface ReversalResponse {
  transaction: {
    id: string;
    type: string;
    amount: string;
    fromUserId: string;
    toUserId: string;
    relatedTransactionId: string;
    description?: string;
    createdAt: string;
    status: string;
  };
}

export interface ReversalServiceResult {
  success: boolean;
  data?: ReversalResponse;
  error?: string;
  status?: number;
}

export async function createReversal(
  input: ReversalInput
): Promise<ReversalServiceResult> {
  try {
    const data = await apiClient<ReversalResponse>("/transactions/reversal", {
      method: "POST",
      body: JSON.stringify({
        relatedTransactionId: input.relatedTransactionId,
        description: input.description || "Reversão de transação",
      }),
      requireAuth: true,
      idempotencyKey: true,
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
      error: "Erro inesperado ao processar reversão. Tente novamente.",
      status: 500,
    };
  }
}
