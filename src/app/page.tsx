'use client'
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Wallet, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const {push} = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-16">
          <div className="bg-card px-6 py-3 rounded-2xl shadow-lg">
            <Logo />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            Sua carteira digital completa
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Gerencie seu dinheiro de forma simples, rápida e segura
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => push("/register")}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-14 text-lg px-8"
            >
              Criar conta grátis
            </Button>
            <Button 
              onClick={() => push("/login")}
              size="lg"
              variant="outline"
              className="bg-card/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-card/20 rounded-xl h-14 text-lg px-8"
            >
              Já tenho conta
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Controle total</h3>
            <p className="text-muted-foreground">
              Acompanhe todas suas transações e gerencie seu saldo em tempo real
            </p>
          </div>

          <div className="bg-card/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Transferências instantâneas</h3>
            <p className="text-muted-foreground">
              Envie e receba dinheiro na hora, de forma simples e descomplicada
            </p>
          </div>

          <div className="bg-card/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Segurança garantida</h3>
            <p className="text-muted-foreground">
              Seus dados e transações protegidos com a melhor tecnologia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};