"use server";

import { cookies } from "next/headers";
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

async function getUserByEmail(email: string, accessToken: string): Promise<{ id: string } | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${apiUrl}/users/email?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function transferTransaction(
  input: TransferInput
): Promise<ActionResult<TransferResponse>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        error: "Não autenticado. Faça login novamente.",
        status: 401
      };
    }

    const destinatario = await getUserByEmail(input.toUserEmail, accessToken);

    if (!destinatario) {
      return {
        success: false,
        error: "Usuário destinatário não encontrado.",
        status: 404
      };
    }

    const idempotencyKey = crypto.randomUUID();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const response = await fetch(`${apiUrl}/transactions/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "idempotency-key": idempotencyKey,
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        toUserId: destinatario.id,
        amount: input.amount,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Sessão expirada. Faça login novamente.",
          status: 401
        };
      }

      let errorMessage = "Erro ao processar transferência";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}

      return { success: false, error: errorMessage, status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Transfer transaction error:", error);
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
      status: 500
    };
  }
}
