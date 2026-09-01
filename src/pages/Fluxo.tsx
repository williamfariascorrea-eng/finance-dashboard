import { useMemo, useState } from 'react';
import { useFinanceStore } from '../context/store';
import { formatBRL, formatDatePt, formatSigned, monthKey } from '../utils/money';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Fluxo() {
  const { transactions } = useFinanceStore();
  const [ano, setAno] = useState(new Date().getFullYear());
  const [expanded, setExpanded] = useState<string | null>(null);

  const transactionsPorMes = useMemo(() => {
    const porMes: Record<string, typeof transactions> = {};

    transactions.forEach((t) => {
      const key = monthKey(t.date);
      if (key.slice(0, 4) === String(ano)) {
        if (!porMes[key]) porMes[key] = [];
        porMes[key].push(t);
      }
    });

    return porMes;
  }, [transactions, ano]);

  const totaisPorMes = useMemo(() => {
    const totais: Record<string, { entrada: number; saida: number; saldo: number }> = {};

    Object.entries(transactionsPorMes).forEach(([key, transacoes]) => {
      let entrada = 0;
      let saida = 0;
      transacoes.forEach((t) => {
        if (t.type === 'entrada') entrada += t.amount;
        else saida += t.amount;
      });
      totais[key] = { entrada, saida, saldo: entrada - saida };
    });

    return totais;
  }, [transactionsPorMes]);

  const totalAno = useMemo(() => {
    return Object.values(totaisPorMes).reduce(
      (acc, t) => ({
        entrada: acc.entrada + t.entrada,
        saida: acc.saida + t.saida,
        saldo: acc.saldo + t.saldo,
      }),
      { entrada: 0, saida: 0, saldo: 0 }
    );
  }, [totaisPorMes]);

  const years = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 4)));
    set.add(String(ano));
    return [...set].sort();
  }, [transactions, ano]);

  const toggleMonth = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">Financeiro</span>
          <h1>Fluxo de Caixa</h1>
          <p>Visão mensal detalhada de entradas e saídas</p>
        </div>
        <div className="page-actions">
          <select
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            className="year-select"
            aria-label="Selecionar ano"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="fluxo-summary">
        <div className="fluxo-card fluxo-card--entrada">
          <span>Total Entradas</span>
          <strong>{formatBRL(totalAno.entrada)}</strong>
        </div>
        <div className="fluxo-card fluxo-card--saida">
          <span>Total Saídas</span>
          <strong>{formatBRL(totalAno.saida)}</strong>
        </div>
        <div className={`fluxo-card ${totalAno.saldo >= 0 ? 'fluxo-card--positivo' : 'fluxo-card--negativo'}`}>
          <span>Saldo do Ano</span>
          <strong>{formatBRL(totalAno.saldo)}</strong>
        </div>
      </div>

      <div className="fluxo-table">
        <div className="fluxo-table__header">
          <span>Mês</span>
          <span>Entradas</span>
          <span>Saídas</span>
          <span>Saldo</span>
          <span></span>
        </div>

        {MESES.map((mes) => {
          const index = MESES.indexOf(mes);
          const key = `${ano}-${String(index + 1).padStart(2, '0')}`;
          const totais = totaisPorMes[key] || { entrada: 0, saida: 0, saldo: 0 };
          const transacoes = transactionsPorMes[key] || [];
          const isExpanded = expanded === key;

          return (
            <div key={mes} className="fluxo-table__row-group">
              <button
                type="button"
                className={`fluxo-table__row ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => toggleMonth(key)}
                aria-expanded={isExpanded}
                disabled={transacoes.length === 0}
              >
                <span className="fluxo-table__month">{mes}</span>
                <span className="fluxo-table__entrada">{formatBRL(totais.entrada)}</span>
                <span className="fluxo-table__saida">{formatBRL(totais.saida)}</span>
                <span className={`fluxo-table__saldo ${totais.saldo >= 0 ? 'positive' : 'negative'}`}>
                  {formatBRL(totais.saldo)}
                </span>
                <span className="fluxo-table__expand">
                  {transacoes.length > 0 && (
                    <svg viewBox="0 0 24 24" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </span>
              </button>

              {isExpanded && transacoes.length > 0 && (
                <div className="fluxo-table__details">
                  {transacoes.map((t) => (
                    <div key={t.id} className="fluxo-table__detail-row">
                      <span className="fluxo-table__detail-name">{t.name}</span>
                      <span className={`type-${t.type}`}>{t.type}</span>
                      <span className={t.type === 'entrada' ? 'positive' : 'negative'}>
                        {formatSigned(t.type, t.amount)}
                      </span>
                      <span>{formatDatePt(t.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}