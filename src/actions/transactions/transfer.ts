"use server";

import { revalidatePath } from "next/cache";
import { getUserByEmail, transferToUser } from "@/services/transfer.service";
import type { ActionResult } from "./types";

export interface TransferInput {
  toUserEmail: string;
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

export async function transferTransaction(
  input: TransferInput
): Promise<ActionResult<TransferResponse>> {
  const userResult = await getUserByEmail(input.toUserEmail);

  if (!userResult.success || !userResult.data) {
    return {
      success: false,
      error: userResult.error || "Usuário destinatário não encontrado.",
      status: userResult.status || 404,
    };
  }

  const transferResult = await transferToUser({
    toUserId: userResult.data.id,
    amount: input.amount,
  });

  if (!transferResult.success) {
    return {
      success: false,
      error: transferResult.error || "Erro ao processar transferência.",
      status: transferResult.status || 500,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    data: transferResult.data,
    status: 200,
  };
}
