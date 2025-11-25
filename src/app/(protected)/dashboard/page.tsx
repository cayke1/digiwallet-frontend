'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ArrowUpRight, ArrowDownRight, Plus, Send, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: number;
  tipo: "deposito" | "transferencia_enviada" | "transferencia_recebida";
  valor: number;
  data: string;
  status: "concluido" | "pendente";
}

export default function Dashboard () {
  const {push} = useRouter();
  const [saldo] = useState(2500.00);
  const [transacoes] = useState<Transaction[]>([
    { id: 1, tipo: "deposito", valor: 1000.00, data: "2025-11-24 10:30", status: "concluido" },
    { id: 2, tipo: "transferencia_enviada", valor: 150.00, data: "2025-11-23 15:20", status: "concluido" },
    { id: 3, tipo: "transferencia_recebida", valor: 500.00, data: "2025-11-23 09:15", status: "concluido" },
    { id: 4, tipo: "deposito", valor: 1150.00, data: "2025-11-22 14:00", status: "concluido" },
  ]);

  const handleLogout = () => {
    push("/login");
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
        {/* Card de Saldo */}
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm opacity-90">Saldo disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">
              R$ {saldo.toFixed(2).replace('.', ',')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => push("/deposito")}
                className="bg-success hover:bg-success/90 text-success-foreground rounded-xl h-12 gap-2"
              >
                <Plus className="w-5 h-5" />
                Depositar
              </Button>
              <Button 
                onClick={() => push("/transferencia")}
                className="bg-card text-primary hover:bg-card/90 rounded-xl h-12 gap-2"
              >
                <Send className="w-5 h-5" />
                Transferir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Button 
              variant="link" 
              onClick={() => push("/extrato")}
              className="text-primary"
            >
              Ver todas
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {transacoes.slice(0, 4).map((transacao) => (
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
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
