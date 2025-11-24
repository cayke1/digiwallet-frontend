import { Wallet } from "lucide-react";

export function Logo () {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-secondary p-2 rounded-xl">
        <Wallet className="w-6 h-6 text-secondary-foreground" />
      </div>
      <span className="text-2xl font-bold text-primary">DigiWallet</span>
    </div>
  );
};
