'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Transaction {
  id: number;
  tipo: "deposito" | "transferencia_enviada" | "transferencia_recebida";
  valor: number;
  data: string;
  status: "concluido" | "pendente";
  podeReverter: boolean;
}

export default function Statement() {
   const { push } = useRouter();
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transacoes, setTransacoes] = useState<Transaction[]>([
    { id: 1, tipo: "deposito", valor: 1000.00, data: "2025-11-24 10:30", status: "concluido", podeReverter: true },
    { id: 2, tipo: "transferencia_enviada", valor: 150.00, data: "2025-11-23 15:20", status: "concluido", podeReverter: true },
    { id: 3, tipo: "transferencia_recebida", valor: 500.00, data: "2025-11-23 09:15", status: "concluido", podeReverter: false },
    { id: 4, tipo: "deposito", valor: 1150.00, data: "2025-11-22 14:00", status: "concluido", podeReverter: false },
    { id: 5, tipo: "transferencia_enviada", valor: 75.50, data: "2025-11-22 11:30", status: "concluido", podeReverter: false },
    { id: 6, tipo: "transferencia_recebida", valor: 200.00, data: "2025-11-21 16:45", status: "concluido", podeReverter: false },
  ]);

  const handleRevertClick = (transacao: Transaction) => {
    setSelectedTransaction(transacao);
    setShowRevertDialog(true);
  };

  const handleConfirmRevert = () => {
    if (selectedTransaction) {
      setTransacoes(transacoes.filter(t => t.id !== selectedTransaction.id));
      toast.success("Transação revertida com sucesso!");
      setShowRevertDialog(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => push("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Extrato</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Todas as transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {transacoes.map((transacao) => (
              <div 
                key={transacao.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
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
                  <div className="flex-1">
                    <p className="font-medium">
                      {transacao.tipo === "deposito" && "Depósito"}
                      {transacao.tipo === "transferencia_enviada" && "Transferência enviada"}
                      {transacao.tipo === "transferencia_recebida" && "Transferência recebida"}
                    </p>
                    <p className="text-sm text-muted-foreground">{transacao.data}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: <span className="text-success">{transacao.status}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-right font-semibold ${
                    transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida"
                      ? "text-success"
                      : "text-destructive"
                  }`}>
                    {transacao.tipo === "deposito" || transacao.tipo === "transferencia_recebida" ? "+" : "-"}
                    R$ {transacao.valor.toFixed(2).replace('.', ',')}
                  </div>
                  
                  {transacao.podeReverter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevertClick(transacao)}
                      className="rounded-lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reverter
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar reversão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja reverter esta transação? Esta ação não pode ser desfeita.
              {selectedTransaction && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedTransaction.tipo === "deposito" && "Depósito"}
                    {selectedTransaction.tipo === "transferencia_enviada" && "Transferência enviada"}
                    {selectedTransaction.tipo === "transferencia_recebida" && "Transferência recebida"}
                  </p>
                  <p className="text-lg font-bold mt-1">
                    R$ {selectedTransaction.valor.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRevert}>
              Confirmar reversão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};