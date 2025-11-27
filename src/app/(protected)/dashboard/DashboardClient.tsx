"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  LogOut,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";
import type { User } from "@/services/user.service";
import type { Transaction } from "@/services/transaction.service";

interface DashboardClientProps {
  user: User;
  recentTransactions: Transaction[];
}

export function DashboardClient({
  user,
  recentTransactions,
}: DashboardClientProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getTransactionLabel = (transaction: Transaction) => {
    if (transaction.type === "DEPOSIT") {
      return "Depósito";
    }
    if (transaction.type === "REVERSAL") {
      return "Estorno";
    }
    if (transaction.toUserId === user.id) {
      return "Transferência recebida";
    }
    return "Transferência enviada";
  };

  const isIncoming = (transaction: Transaction) => {
    return (
      transaction.type === "DEPOSIT" ||
      (transaction.type === "TRANSFER" && transaction.toUserId === user.id)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm opacity-90">
              Saldo disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">
             {formatCurrency(Number(user.balance))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/deposit"
                className="bg-success hover:bg-success/90 text-success-foreground rounded-xl h-12 gap-2 flex items-center justify-center font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Depositar</span>
              </Link>
              <Link
                href="/dashboard/transfer"
                className="bg-card text-primary hover:bg-card/90 rounded-xl h-12 gap-2 flex items-center justify-center font-semibold"
              >
                <Send className="w-5 h-5" />
                <span>Transferir</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Link href="/dashboard/statement" className="text-primary">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma transação ainda
              </p>
            ) : (
              recentTransactions.slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isIncoming(transaction)
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}
                    >
                      {isIncoming(transaction) ? (
                        <ArrowDownRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {getTransactionLabel(transaction)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-right font-semibold ${
                      isIncoming(transaction)
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {isIncoming(transaction) ? "+" : "-"}
                    {formatCurrency(Number(transaction.amount))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
