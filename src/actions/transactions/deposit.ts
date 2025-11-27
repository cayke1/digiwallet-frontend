"use server";

import { revalidatePath } from "next/cache";
import { createDeposit } from "@/services/deposit.service";
import type { ActionResult, DepositResponse } from "./types";

export interface DepositInput {
  toUserId: string;
  amount: string;
}

export async function depositTransaction(
  input: DepositInput
): Promise<ActionResult<DepositResponse>> {
  const depositResult = await createDeposit({
    toUserId: input.toUserId,
    amount: input.amount,
  });

  if (!depositResult.success) {
    return {
      success: false,
      error: depositResult.error || "Erro ao processar depósito.",
      status: depositResult.status || 500,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    data: depositResult.data,
    status: 200,
  };
}
