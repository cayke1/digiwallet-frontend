"use server";

import { fetchCurrentUser } from "../user/me";
import { fetchTransactionHistory } from "../transactions/history";
import type { User } from "@/services/user.service";
import type { Transaction } from "@/services/transaction.service";
import type { ActionResult } from "../transactions/types";

export interface DashboardData {
  user: User;
  recentTransactions: Transaction[];
}

export async function getDashboardData(): Promise<
  ActionResult<DashboardData>
> {
  const [userResult, transactionsResult] = await Promise.all([
    fetchCurrentUser(),
    fetchTransactionHistory({ limit: 10 }),
  ]);

  if (!userResult.success || !userResult.data) {
    return {
      success: false,
      error: userResult.error || "Erro ao buscar dados do usuário.",
      status: userResult.status || 500,
    };
  }

  if (!transactionsResult.success) {
    return {
      success: false,
      error:
        transactionsResult.error || "Erro ao buscar transações recentes.",
      status: transactionsResult.status || 500,
    };
  }

  return {
    success: true,
    data: {
      user: userResult.data,
      recentTransactions: transactionsResult.data || [],
    },
    status: 200,
  };
}
