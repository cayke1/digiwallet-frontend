"use client";

import { useReducer } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoneyInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (formatted: string, raw: string) => void;
  disabled?: boolean;
  className?: string;
}

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function MoneyInput({
  id,
  label,
  placeholder = "0,00",
  value,
  onChange,
  disabled = false,
  className = "",
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useReducer(
    (_: any, next: string) => {
      const digits = next.replace(/\D/g, "");
      if (!digits) return "";
      return moneyFormatter.format(Number(digits) / 100);
    },
    value
  );

  const handleChange = (formattedValue: string) => {
    const digits = formattedValue.replace(/\D/g, "");
    const rawValue = digits ? (Number(digits) / 100).toString() : "";
    const formatted = digits ? moneyFormatter.format(Number(digits) / 100) : "";

    setDisplayValue(formattedValue);
    onChange(formatted, rawValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          className={className}
        />
      </div>
    </div>
  );
}
