"use server";

import { getCurrentUser, type User } from "@/services/user.service";
import type { ActionResult } from "../transactions/types";

export async function fetchCurrentUser(): Promise<ActionResult<User>> {
  const result = await getCurrentUser();

  if (result.success && result.data) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || "Erro ao buscar usuário.",
    status: result.status || 500,
  };
}
