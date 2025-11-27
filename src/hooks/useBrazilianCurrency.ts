import { useState, useMemo } from 'react';

export function useBrazilianCurrency(initialValue: string = '') {
  const [rawDigits, setRawDigits] = useState(initialValue);

  const displayValue = useMemo(() => {
    if (!rawDigits || rawDigits === '0') return '0,00';

    const valueInCents = parseInt(rawDigits, 10);
    const reais = Math.floor(valueInCents / 100);
    const centavos = valueInCents % 100;

    const formattedReais = reais.toLocaleString('pt-BR');
    const formattedCentavos = centavos.toString().padStart(2, '0');

    return `${formattedReais},${formattedCentavos}`;
  }, [rawDigits]);

  const apiValue = useMemo(() => {
    if (!rawDigits || rawDigits === '0') return '0.00';

    const valueInCents = parseInt(rawDigits, 10);
    return (valueInCents / 100).toFixed(2);
  }, [rawDigits]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setRawDigits(digitsOnly);
  };

  const setValue = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setRawDigits(digitsOnly);
  };

  const clear = () => setRawDigits('');

  return { displayValue, apiValue, rawDigits, handleChange, setValue, clear };
}
