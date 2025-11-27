"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { depositTransaction } from "@/actions/transactions/deposit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoneyInput } from "@/components/form/MoneyInput";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface DepositFormProps {
  userId: string;
}

export function DepositForm({ userId }: DepositFormProps) {
  const { push } = useRouter();
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (formatted: string, raw: string) => {
    setDisplayAmount(formatted);
    setAmount(raw);
  };

  const handleDeposito = async (e: FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(amount);
    if (!numericValue || numericValue <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    setIsLoading(true);

    const result = await depositTransaction({
      toUserId: userId,
      amount: amount,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success(`Depósito de ${displayAmount} realizado com sucesso!`);
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
          <h1 className="text-xl font-bold">Depósito</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Quanto você deseja depositar?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposito} className="space-y-6">
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
                  O valor será creditado instantaneamente em sua conta.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-success hover:bg-success/90 text-success-foreground rounded-xl h-12"
              >
                {isLoading ? "Processando..." : "Confirmar Depósito"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
