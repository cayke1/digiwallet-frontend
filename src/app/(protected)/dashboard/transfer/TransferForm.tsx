"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { transferTransaction } from "@/actions/transactions/transfer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/form/MoneyInput";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function TransferForm() {
  const { push } = useRouter();
  const [emailDestino, setEmailDestino] = useState("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (formatted: string, raw: string) => {
    setDisplayAmount(formatted);
    setAmount(raw);
  };

  const handleTransferencia = async (e: FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(amount);

    if (!emailDestino || !numericValue) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (numericValue <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!emailDestino.includes("@")) {
      toast.error("Digite um e-mail válido");
      return;
    }

    setIsLoading(true);

    const result = await transferTransaction({
      toUserEmail: emailDestino,
      amount: amount,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success(
        `Transferência de ${displayAmount} enviada com sucesso!`
      );
      push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Transferência</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Para quem você quer enviar?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransferencia} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail do destinatário</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="destinatario@email.com"
                  value={emailDestino}
                  onChange={(e) => setEmailDestino(e.target.value)}
                  disabled={isLoading}
                  className="rounded-lg"
                />
              </div>

              <MoneyInput
                id="valor"
                label="Valor"
                placeholder="R$ 0,00"
                value={displayAmount}
                onChange={handleAmountChange}
                disabled={isLoading}
                className="rounded-lg text-2xl text-right"
              />

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  A transferência será processada instantaneamente e o
                  destinatário receberá uma notificação.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl h-12"
              >
                {isLoading ? "Processando..." : "Enviar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
