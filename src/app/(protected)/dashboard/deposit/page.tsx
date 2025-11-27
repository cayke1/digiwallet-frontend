'use client'
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrazilianCurrency } from "@/hooks/useBrazilianCurrency";
import { depositTransaction } from "@/actions/transactions/deposit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Deposit() {
  const { user, refreshUser } = useAuth();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { displayValue, apiValue, handleChange } = useBrazilianCurrency();

  const handleDeposito = async (e: FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(apiValue);
    if (!numericValue || numericValue <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsLoading(true);


    const result = await depositTransaction({
      toUserId: user.id,
      amount: apiValue
    });

    setIsLoading(false);

    if (result.success) {
      await refreshUser();
      toast.success(`Depósito de R$ ${displayValue} realizado com sucesso!`);
      push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => push("/dashboard")}>
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
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="valor"
                    type="text"
                    placeholder="0,00"
                    value={displayValue}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 rounded-lg text-2xl h-16 text-right"
                  />
                </div>
              </div>

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
};