import { redirect } from "next/navigation";
import { getDashboardData } from "@/actions/dashboard/getDashboardData";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  return (
    <DashboardClient
      user={result.data.user}
      recentTransactions={result.data.recentTransactions}
    />
  );
}
