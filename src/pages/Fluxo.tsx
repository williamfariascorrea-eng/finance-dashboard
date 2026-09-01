import { useMemo, useState } from 'react';
import { useFinanceStore } from '../context/store';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function Fluxo() {
  const { transactions } = useFinanceStore();
  const [ano, setAno] = useState(2026);
  const [Expanded, setExpanded] = useState<number | null>(null);

  const transactionsPorMes = useMemo(() => {
    const porMes: Record<string, typeof transactions> = {};
    
    transactions.forEach((t) => {
      const dateMatch = t.date.match(/(\w+)\s+(\d{4})/);
      if (dateMatch) {
        const mes = dateMatch[1];
        const anoT = parseInt(dateMatch[2]);
        if (anoT === ano) {
          if (!porMes[mes]) porMes[mes] = [];
          porMes[mes].push(t);
        }
      }
    });
    
    return porMes;
  }, [transactions, ano]);

  const totaisPorMes = useMemo(() => {
    const totais: Record<string, { entrada: number; saida: number; saldo: number }> = {};
    
    Object.entries(transactionsPorMes).forEach(([mes, transacoes]) => {
      let entrada = 0;
      let saida = 0;
      transacoes.forEach((t) => {
        const valor = parseFloat(t.amount.replace(/[R$\s+]/g, '').replace(/\./g, '').replace(',', '.'));
        if (t.type === 'entrada') entrada += valor;
        else saida += valor;
      });
      totais[mes] = { entrada, saida, saldo: entrada - saida };
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const toggleMonth = (index: number) => {
    setExpanded(Expanded === index ? null : index);
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
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </header>

      <div className="fluxo-summary">
        <div className="fluxo-card fluxo-card--entrada">
          <span>Total Entradas</span>
          <strong>{formatCurrency(totalAno.entrada)}</strong>
        </div>
        <div className="fluxo-card fluxo-card--saida">
          <span>Total Saídas</span>
          <strong>{formatCurrency(totalAno.saida)}</strong>
        </div>
        <div className={`fluxo-card ${totalAno.saldo >= 0 ? 'fluxo-card--positivo' : 'fluxo-card--negativo'}`}>
          <span>Saldo do Ano</span>
          <strong>{formatCurrency(totalAno.saldo)}</strong>
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

        {MESES.map((mes, index) => {
          const totais = totaisPorMes[mes] || { entrada: 0, saida: 0, saldo: 0 };
          const transacoes = transactionsPorMes[mes] || [];
          const isExpanded = Expanded === index;

          return (
            <div key={mes} className="fluxo-table__row-group">
              <button 
                type="button"
                className={`fluxo-table__row ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => toggleMonth(index)}
                aria-expanded={isExpanded}
              >
                <span className="fluxo-table__month">{mes}</span>
                <span className="fluxo-table__entrada">{formatCurrency(totais.entrada)}</span>
                <span className="fluxo-table__saida">{formatCurrency(totais.saida)}</span>
                <span className={`fluxo-table__saldo ${totais.saldo >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(totais.saldo)}
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
                      <span>{t.name}</span>
                      <span className={`type-${t.type}`}>{t.type}</span>
                      <span className={t.type === 'entrada' ? 'positive' : 'negative'}>
                        {t.amount}
                      </span>
                      <span>{t.date}</span>
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