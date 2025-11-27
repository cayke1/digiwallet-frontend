import { redirect } from "next/navigation";
import { fetchCurrentUser } from "@/actions/user/me";
import { DepositForm } from "./DepositForm";

export default async function DepositPage() {
  const result = await fetchCurrentUser();

  if (!result.success || !result.data) {
    redirect("/login");
  }

  return <DepositForm userId={result.data.id} />;
}