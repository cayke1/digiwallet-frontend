import { apiClient, ApiClientError } from "@/lib/api-client";

export interface Transaction {
  id: string;
  type: "DEPOSIT" | "TRANSFER" | "REVERSAL";
  status: "COMPLETED" | "REVERSED" | "FAILED";
  amount: string;
  fromUserId?: string;
  toUserId?: string;
  relatedTransactionId?: string;
  mirrorTransactionId?: string | null;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistoryParams {
  limit?: number;
  offset?: number;
  type?: "DEPOSIT" | "TRANSFER" | "REVERSAL";
  status?: "COMPLETED" | "REVERSED" | "FAILED";
}

export type TransactionHistoryResponse = Transaction[]

export interface TransactionServiceResult {
  success: boolean;
  data?: TransactionHistoryResponse;
  error?: string;
  status?: number;
}

export async function getTransactionHistory(
  params?: TransactionHistoryParams
): Promise<TransactionServiceResult> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const endpoint = `/transactions/history${queryString ? `?${queryString}` : ""}`;

    const data = await apiClient<TransactionHistoryResponse>(endpoint, {
      method: "GET",
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
      error: "Erro inesperado ao buscar histórico. Tente novamente.",
      status: 500,
    };
  }
}
