"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { reversalTransaction } from "@/actions/transactions/reversal";
import type { Transaction } from "@/services/transaction.service";

interface StatementClientProps {
  initialTransactions: Transaction[];
  currentUserId?: string;
}

interface TransactionDisplay {
  id: string;
  tipo: "deposito" | "transferencia_enviada" | "transferencia_recebida";
  valor: number;
  data: string;
  status: "concluido" | "pendente" | "revertido" | "falhou";
  podeReverter: boolean;
}

export default function StatementClient({
  initialTransactions,
  currentUserId,
}: StatementClientProps) {
  const { push } = useRouter();
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDisplay | null>(null);
  const [reversalDescription, setReversalDescription] = useState("");
  const [isReverting, setIsReverting] = useState(false);

  const transactions = useMemo(() => {
    const mainTransactions = initialTransactions.filter(
      (t) => !t.mirrorTransactionId
    );

    return mainTransactions.map((t): TransactionDisplay => {
      let type: TransactionDisplay["tipo"] = "deposito";
      let canReverse = false;

      switch (t.type) {
        case "DEPOSIT":
          type = "deposito";
          canReverse = t.status === "COMPLETED";
          break;

        case "TRANSFER":
          const isSent = Boolean(currentUserId && t.fromUserId === currentUserId);
          type = isSent ? "transferencia_enviada" : "transferencia_recebida";
          canReverse = isSent && t.status === "COMPLETED";
          break;

        case "REVERSAL":
          const isReversalSent = Boolean(currentUserId && t.fromUserId === currentUserId);
          type = isReversalSent ? "transferencia_enviada" : "transferencia_recebida";
          canReverse = false;
          break;
      }

      let status: TransactionDisplay["status"];
      if (t.status === "COMPLETED") {
        status = "concluido";
      } else if (t.status === "REVERSED") {
        status = "revertido";
      } else if (t.status === "FAILED") {
        status = "falhou";
      } else {
        status = "pendente";
      }

      return {
        id: t.id,
        tipo: type,
        valor: parseFloat(t.amount),
        data: new Date(t.createdAt).toLocaleString("pt-BR"),
        status,
        podeReverter: canReverse,
      };
    });
  }, [initialTransactions, currentUserId]);

  const handleRevertClick = (transacao: TransactionDisplay) => {
    setSelectedTransaction(transacao);
    setReversalDescription("");
    setShowRevertDialog(true);
  };

  const handleConfirmRevert = async () => {
    if (!selectedTransaction) return;

    setIsReverting(true);

    try {
      const result = await reversalTransaction({
        relatedTransactionId: selectedTransaction.id,
        description: reversalDescription.trim() || undefined,
      });

      if (result.success) {
        toast.success("Transação revertida com sucesso!");
        setShowRevertDialog(false);
        setSelectedTransaction(null);
        setReversalDescription("");

        window.location.reload();
      } else {
        if (result.status === 401) {
          toast.error("Sessão expirada. Redirecionando para login...");
          setTimeout(() => push("/login"), 2000);
        } else if (result.status === 403) {
          toast.error("Você não tem permissão para reverter esta transação.");
        } else if (result.status === 404) {
          toast.error("Transação não encontrada.");
          setShowRevertDialog(false);
        } else if (result.status === 409) {
          toast.error("Esta transação já foi revertida.");
          setShowRevertDialog(false);
        } else if (result.status === 422) {
          toast.error("Reversão não permitida. A transação pode ter expirado.");
          setShowRevertDialog(false);
        } else {
          toast.error(result.error || "Erro ao reverter transação");
        }
      }
    } catch (error) {
      console.error("Erro inesperado na reversão:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsReverting(false);
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
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma transação encontrada.
              </p>
            ) : (
              transactions.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        transacao.tipo === "deposito" ||
                        transacao.tipo === "transferencia_recebida"
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}
                    >
                      {transacao.tipo === "deposito" ||
                      transacao.tipo === "transferencia_recebida" ? (
                        <ArrowDownRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {transacao.tipo === "deposito" && "Depósito"}
                        {transacao.tipo === "transferencia_enviada" &&
                          "Transferência enviada"}
                        {transacao.tipo === "transferencia_recebida" &&
                          "Transferência recebida"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transacao.data}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status:{" "}
                        <span
                          className={
                            transacao.status === "concluido"
                              ? "text-success"
                              : transacao.status === "revertido"
                                ? "text-orange-500"
                                : transacao.status === "falhou"
                                  ? "text-destructive"
                                  : "text-yellow-500"
                          }
                        >
                          {transacao.status === "concluido" && "Concluído"}
                          {transacao.status === "revertido" && "Revertido"}
                          {transacao.status === "falhou" && "Falhou"}
                          {transacao.status === "pendente" && "Pendente"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`text-right font-semibold ${
                        transacao.tipo === "deposito" ||
                        transacao.tipo === "transferencia_recebida"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {transacao.tipo === "deposito" ||
                      transacao.tipo === "transferencia_recebida"
                        ? "+"
                        : "-"}
                      R$ {transacao.valor.toFixed(2).replace(".", ",")}
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
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog
        open={showRevertDialog}
        onOpenChange={(open) => {
          if (!isReverting) {
            setShowRevertDialog(open);
            if (!open) {
              setReversalDescription("");
              setSelectedTransaction(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar reversão</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tem certeza que deseja reverter esta transação? Esta ação não
                  pode ser desfeita.
                </p>
                {selectedTransaction && (
                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <p className="font-medium">
                      {selectedTransaction.tipo === "deposito" && "Depósito"}
                      {selectedTransaction.tipo === "transferencia_enviada" &&
                        "Transferência enviada"}
                      {selectedTransaction.tipo === "transferencia_recebida" &&
                        "Transferência recebida"}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      R$ {selectedTransaction.valor.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Motivo da reversão (opcional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="Ex: Transação duplicada, erro no valor..."
                    value={reversalDescription}
                    onChange={(e) => setReversalDescription(e.target.value)}
                    disabled={isReverting}
                    maxLength={200}
                  />
                  {reversalDescription && (
                    <p className="text-xs text-muted-foreground">
                      {reversalDescription.length}/200 caracteres
                    </p>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReverting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRevert} disabled={isReverting}>
              {isReverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revertendo...
                </>
              ) : (
                "Confirmar reversão"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
