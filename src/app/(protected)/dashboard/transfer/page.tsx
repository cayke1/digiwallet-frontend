'use client'
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrazilianCurrency } from "@/hooks/useBrazilianCurrency";
import { transferTransaction } from "@/actions/transactions/transfer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Transfer() {
  const { refreshUser } = useAuth();
  const { push } = useRouter();
  const [emailDestino, setEmailDestino] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { displayValue, apiValue, handleChange } = useBrazilianCurrency();

  const handleTransferencia = async (e: FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(apiValue);

    if (!emailDestino || !numericValue) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (numericValue <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!emailDestino.includes('@')) {
      toast.error("Digite um e-mail válido");
      return;
    }

    setIsLoading(true);

    const result = await transferTransaction({
      toUserEmail: emailDestino,
      amount: apiValue
    });

    setIsLoading(false);

    if (result.success) {
      await refreshUser();
      toast.success(`Transferência de R$ ${displayValue} enviada com sucesso!`);
      push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => push   ("/dashboard")}>
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
                  A transferência será processada instantaneamente e o destinatário receberá uma notificação.
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
};