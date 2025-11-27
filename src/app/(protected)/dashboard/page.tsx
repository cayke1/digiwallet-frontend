'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ArrowUpRight, ArrowDownRight, Plus, Send, LogOut } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";

interface Transaction {
  id: number;
  tipo: "deposito" | "transferencia_enviada" | "transferencia_recebida";
  valor: number;
  data: string;
  status: "concluido" | "pendente";
}

export default function Dashboard () {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [transacoes] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Card de Saldo */}
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm opacity-90">Saldo disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">
              R$ {formatCurrency(user.balance)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={"/dashboard/deposit"}
                className="bg-success hover:bg-success/90 text-success-foreground rounded-xl h-12 gap-2 flex items-center justify-center font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Depositar</span>
              </Link>
              <Link
                href={"/dashboard/transfer"}
                className="bg-card text-primary hover:bg-card/90 rounded-xl h-12 gap-2 flex items-center justify-center font-semibold"
              >
                <Send className="w-5 h-5" />
               <span>Transferir</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Link
              href={"/dashboard/statement"}
              className="text-primary"
            >
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {transacoes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma transação ainda
              </p>
            ) : (
              transacoes.slice(0, 4).map((transacao) => (
              <div 
                key={transacao.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida"
                      ? "bg-success/10"
                      : "bg-destructive/10"
                  }`}>
                    {transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida" ? (
                      <ArrowDownRight className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transacao.tipo === "deposito" && "Depósito"}
                      {transacao.tipo === "transferencia_enviada" && "Transferência enviada"}
                      {transacao.tipo === "transferencia_recebida" && "Transferência recebida"}
                    </p>
                    <p className="text-sm text-muted-foreground">{transacao.data}</p>
                  </div>
                </div>
                <div className={`text-right font-semibold ${
                  transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida"
                    ? "text-success"
                    : "text-destructive"
                }`}>
                  {transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida" ? "+" : "-"}
                  R$ {transacao.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
