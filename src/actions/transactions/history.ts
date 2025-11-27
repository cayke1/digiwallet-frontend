"use server";

import {
  getTransactionHistory,
  type TransactionHistoryParams,
  type TransactionHistoryResponse,
} from "@/services/transaction.service";
import type { ActionResult } from "./types";

export async function fetchTransactionHistory(
  params?: TransactionHistoryParams
): Promise<ActionResult<TransactionHistoryResponse>> {
  const result = await getTransactionHistory(params);

  if (result.success && result.data) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || "Erro ao buscar histórico de transações.",
    status: result.status || 500,
  };
}
