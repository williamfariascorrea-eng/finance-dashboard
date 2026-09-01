import { useMemo } from 'react';
import type { Transaction } from '../types';

interface MetricsResult {
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
  economiaTaxa: number;
  ticketMedioEntrada: number;
  ticketMedioSaida: number;
  despesaFixaPercent: number;
  despesaVariavelPercent: number;
  maiorDespesa: { name: string; value: number } | null;
  menorDespesa: { name: string; value: number } | null;
  categoriaMaisGasta: string | null;
  tendencia: 'alta' | 'baixa' | 'estavel';
  projeçãoProximoMes: number;
  diasSobrevivência: number;
}

export function useAdvancedMetrics(transactions: Transaction[]): MetricsResult {
  return useMemo(() => {
    const entradas = transactions.filter(t => t.type === 'entrada');
    const saidas = transactions.filter(t => t.type === 'saida');

    const totalReceita = entradas.reduce((acc, t) => {
      const value = parseFloat(t.amount.replace(/[R$\s.+]/g, '').replace(',', '.'));
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    const totalDespesa = saidas.reduce((acc, t) => {
      const value = parseFloat(t.amount.replace(/[R$\s.-]/g, '').replace(',', '.'));
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    const saldo = totalReceita - totalDespesa;
    const economiaTaxa = totalReceita > 0 ? ((saldo / totalReceita) * 100) : 0;

    const ticketMedioEntrada = entradas.length > 0 ? totalReceita / entradas.length : 0;
    const ticketMedioSaida = saidas.length > 0 ? totalDespesa / saidas.length : 0;

    const categoriasFixas = ['Aluguel', 'Internet', 'Luz', 'Água', 'Telefone', 'Assinaturas'];
    const despesaFixa = saidas
      .filter(t => categoriasFixas.some(cat => t.category.toLowerCase().includes(cat.toLowerCase())))
      .reduce((acc, t) => {
        const value = parseFloat(t.amount.replace(/[R$\s.-]/g, '').replace(',', '.'));
        return acc + (isNaN(value) ? 0 : value);
      }, 0);

    const despesaFixaPercent = totalDespesa > 0 ? (despesaFixa / totalDespesa) * 100 : 0;
    const despesaVariavelPercent = 100 - despesaFixaPercent;

    const sortedSaidas = [...saidas].sort((a, b) => {
      const valA = parseFloat(a.amount.replace(/[R$\s.-]/g, '').replace(',', '.'));
      const valB = parseFloat(b.amount.replace(/[R$\s.-]/g, '').replace(',', '.'));
      return valB - valA;
    });

    const maiorDespesa = sortedSaidas.length > 0 ? {
      name: sortedSaidas[0].name,
      value: parseFloat(sortedSaidas[0].amount.replace(/[R$\s.-]/g, '').replace(',', '.'))
    } : null;

    const menorDespesa = sortedSaidas.length > 0 ? {
      name: sortedSaidas[sortedSaidas.length - 1].name,
      value: parseFloat(sortedSaidas[sortedSaidas.length - 1].amount.replace(/[R$\s.-]/g, '').replace(',', '.'))
    } : null;

    const categorySpending: Record<string, number> = {};
    saidas.forEach(t => {
      const value = parseFloat(t.amount.replace(/[R$\s.-]/g, '').replace(',', '.'));
      categorySpending[t.category] = (categorySpending[t.category] || 0) + value;
    });

    const categoriaMaisGasta = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const months = [...new Set(saidas.map(t => t.date.split(' ')[1]))];

    const médiaMensal = totalDespesa / Math.max(months.length, 1);
    const projeçãoProximoMes = médiaMensal;

    const custoDiárioMédia = totalDespesa / 30;
    const diasSobrevivência = custoDiárioMédia > 0 ? Math.round(saldo / custoDiárioMédia) : 0;

    return {
      totalReceita,
      totalDespesa,
      saldo,
      economiaTaxa,
      ticketMedioEntrada,
      ticketMedioSaida,
      despesaFixaPercent,
      despesaVariavelPercent,
      maiorDespesa,
      menorDespesa,
      categoriaMaisGasta,
      tendencia: 'estavel',
      projeçãoProximoMes,
      diasSobrevivência,
    };
  }, [transactions]);
}

export const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};