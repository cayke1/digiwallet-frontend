"use server";

import { createReversal } from "@/services/reversal.service";
import type { ActionResult } from "./types";

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

export async function reversalTransaction(
  input: ReversalInput
): Promise<ActionResult<ReversalResponse>> {
  if (!input.relatedTransactionId || input.relatedTransactionId.trim() === "") {
    return {
      success: false,
      error: "ID da transação relacionada é obrigatório.",
      status: 400,
    };
  }

  const result = await createReversal({
    relatedTransactionId: input.relatedTransactionId,
    description: input.description,
  });

  if (result.success && result.data) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || "Erro ao processar reversão.",
    status: result.status || 500,
  };
}
