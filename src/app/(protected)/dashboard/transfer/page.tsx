'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Transfer() {
  const { push } = useRouter();
  const [emailDestino, setEmailDestino] = useState("");
  const [valor, setValor] = useState("");

  const handleTransferencia = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (!emailDestino || !valor) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (!emailDestino.includes('@')) {
      toast.error("Digite um e-mail válido");
      return;
    }

    toast.success(`Transferência de R$ ${valorNumerico.toFixed(2).replace('.', ',')} enviada com sucesso!`);
    push    ("/dashboard");
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
                    value={valor}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d,]/g, '');
                      setValor(value);
                    }}
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
                className="w-full rounded-xl h-12"
              >
                Enviar
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};