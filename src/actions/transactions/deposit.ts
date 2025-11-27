"use server";

import { cookies } from "next/headers";
import type { ActionResult, DepositResponse } from "./types";

export interface DepositInput {
  toUserId: string;
  amount: string;
}

export async function depositTransaction(
  input: DepositInput
): Promise<ActionResult<DepositResponse>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Não autenticado. Faça login novamente.",
      };
    }

    const idempotencyKey = crypto.randomUUID();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(`${apiUrl}/transactions/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "idempotency-key": idempotencyKey,
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        toUserId: input.toUserId,
        amount: input.amount,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Sessão expirada. Faça login novamente.",
        };
      }

      let errorMessage = "Erro ao processar depósito";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}

      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Deposit transaction error:", error);
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}
