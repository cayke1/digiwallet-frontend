import { fetchTransactionHistory } from "@/actions/transactions/history";
import { fetchCurrentUser } from "@/actions/user/me";
import { redirect } from "next/navigation";
import StatementClient from "./StatementClient";

export default async function StatementPage() {
  const [userResult, historyResult] = await Promise.all([
    fetchCurrentUser(),
    fetchTransactionHistory({ limit: 50 }),
  ]);

  if (!userResult.success && userResult.status === 401) {
    redirect("/login");
  }

  if (!historyResult.success && historyResult.status === 401) {
    redirect("/login");
  }

  return (
    <StatementClient
      initialTransactions={historyResult.data || []}
      currentUserId={userResult.data?.id}
    />
  );
}