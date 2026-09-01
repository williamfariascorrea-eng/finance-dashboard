import { useMemo } from 'react';
import { useFinanceStore } from '../context/store';
import { buildMonthlyExpenses } from '../utils/metrics';
import { formatBRL } from '../utils/money';

const PROJECTION_MONTHS = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];

export default function Planejamento() {
  const { transactions } = useFinanceStore();

  const totais = useMemo(() => {
    let entradaTotal = 0;
    let saidaTotal = 0;

    transactions.forEach((t) => {
      if (t.type === 'entrada') entradaTotal += t.amount;
      else saidaTotal += t.amount;
    });

    const totalMeses = Math.max(new Set(transactions.map((t) => t.date.slice(0, 7))).size, 1);

    return {
      entradaTotal,
      saidaTotal,
      saldoTotal: entradaTotal - saidaTotal,
      mediaEntrada: entradaTotal / totalMeses,
      mediaSaida: saidaTotal / totalMeses,
      totalMeses,
    };
  }, [transactions]);

  const mediasMensais = useMemo(() => {
    const monthly = buildMonthlyExpenses(transactions, null, 7);
    const maxValue = Math.max(...monthly.map((m) => m.value), 1);
    return monthly.map((m) => ({
      month: m.month,
      average: m.value,
      percentage: (m.value / maxValue) * 100,
    }));
  }, [transactions]);

  const projectionData = useMemo(() => {
    let saldoAtual = totais.saldoTotal;

    return PROJECTION_MONTHS.map((mes) => {
      const entrada = totais.mediaEntrada;
      const saida = totais.mediaSaida * 0.95;
      saldoAtual = saldoAtual + entrada - saida;

      return {
        month: mes,
        entrada,
        saida,
        saldo: saldoAtual,
      };
    });
  }, [totais]);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">Estratégico</span>
          <h1>Planejamento</h1>
          <p>Análise de tendências e projeções financeiras</p>
        </div>
      </header>

      <section className="plan-header-cards">
        <div className="plan-card">
          <span>Média Entradas</span>
          <strong>{formatBRL(totais.mediaEntrada)}</strong>
          <p>Mensal</p>
        </div>
        <div className="plan-card">
          <span>Média Saídas</span>
          <strong>{formatBRL(totais.mediaSaida)}</strong>
          <p>Mensal</p>
        </div>
        <div className="plan-card">
          <span>Saldo Acumulado</span>
          <strong className={totais.saldoTotal >= 0 ? 'positive' : 'negative'}>
            {formatBRL(totais.saldoTotal)}
          </strong>
          <p>Histórico completo</p>
        </div>
      </section>

      <section className="plan-section">
        <h2>Projeção de Saldo</h2>
        <div className="plan-table">
          <div className="plan-table__header">
            <span>Mês</span>
            <span>Entrada</span>
            <span>Saída</span>
            <span>Saldo Acumulado</span>
          </div>
          {projectionData.map((p) => (
            <div key={p.month} className="plan-table__row">
              <span>{p.month}</span>
              <span className="positive">{formatBRL(p.entrada)}</span>
              <span className="negative">{formatBRL(p.saida)}</span>
              <span className={p.saldo >= 0 ? 'positive' : 'negative'}>
                {formatBRL(p.saldo)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="plan-section">
        <h2>Análise de Despesas por Mês</h2>
        <div className="plan-bars">
          {mediasMensais.map((m) => (
            <div key={m.month} className="plan-bar">
              <div className="plan-bar__label">
                <span>{m.month}</span>
                <span>{formatBRL(m.average)}</span>
              </div>
              <div className="plan-bar__track">
                <div
                  className="plan-bar__fill"
                  style={{ width: `${Math.min(m.percentage, 100)}%` }}
                />
              </div>
              <span className="plan-bar__percent">{m.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="plan-section">
        <h2>Alertas</h2>
        <div className="plan-alerts">
          {totais.saldoTotal < totais.mediaSaida * 3 && (
            <div className="plan-alert plan-alert--warning">
              <span>⚠️</span>
              <div>
                <strong>Atenção ao caixa</strong>
                <p>
                  Seu saldo atual cobre menos de 3 meses de despesas médias.
                  Considere reduzir custos variáveis.
                </p>
              </div>
            </div>
          )}
          {totais.mediaSaida > totais.mediaEntrada * 0.7 && (
            <div className="plan-alert plan-alert--warning">
              <span>⚠️</span>
              <div>
                <strong>Alta proporção de custos</strong>
                <p>
                  Suas saídas representam mais de 70% das entradas.
                  Revise despesas fixas.
                </p>
              </div>
            </div>
          )}
          {totais.saldoTotal > totais.mediaSaida * 6 && (
            <div className="plan-alert plan-alert--success">
              <span>✅</span>
              <div>
                <strong>Reserva sólida</strong>
                <p>
                  Você tem mais de 6 meses de despesas em reserva.
                  Considere investir o excesso.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}