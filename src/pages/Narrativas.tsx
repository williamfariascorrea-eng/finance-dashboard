import { useMemo } from 'react';
import { useFinanceStore } from '../context/store';

export default function Narrativas() {
  const { transactions, summaryCards } = useFinanceStore();

  const narrativas = useMemo(() => {
    const entradaTotal = transactions
      .filter((t) => t.type === 'entrada')
      .reduce((acc, t) => {
        const valor = parseFloat(
          t.amount.replace(/[R$\s+]/g, '').replace(/\./g, '').replace(',', '.')
        );
        return acc + valor;
      }, 0);

    const saidaTotal = transactions
      .filter((t) => t.type === 'saida')
      .reduce((acc, t) => {
        const valor = parseFloat(
          t.amount.replace(/[R$\s+]/g, '').replace(/\./g, '').replace(',', '.')
        );
        return acc + valor;
      }, 0);

    const saldo = entradaTotal - saidaTotal;
    const taxa = (saidaTotal / entradaTotal) * 100;

    return [
      {
        titulo: 'Performance de Caixa',
        descricao: `Neste período, registramos um volume total de entradas de R$ ${entradaTotal.toLocaleString(
          'pt-BR'
        )}, com saídas de R$ ${saidaTotal.toLocaleString(
          'pt-BR'
        )}. O saldo líquido de R$ ${saldo.toLocaleString('pt-BR')} representa uma ${taxa > 70 ? 'alta pressão no fluxo de caixa' : taxa > 50 ? 'situação confortável' : 'reserva robusta'} com ${taxa.toFixed(1)}% das entradas sendo absorvidos por custos.`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: saldo >= 0 ? 'positivo' : 'negativo',
      },
      {
        titulo: 'Composição de Receitas',
        descricao: `As receitas recorrentes representam R$ ${summaryCards[1]?.value.replace('R$ ', '').replace('.', '') || '0'} do total, correspondendo a ${(
          (parseFloat(summaryCards[1]?.value.replace(/[R$\s.]/g, '') || '0') /
            entradaTotal) *
          100
        ).toFixed(1)}% da receita total. Este indicador ${parseFloat(
          summaryCards[1]?.value.replace(/[R$\s.]/g, '') || '0'
        ) > entradaTotal * 0.5
          ? 'mostra uma base sólida'
          : 'sugere diversificação'} com ênfase em receitas variáveis.`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: 'neutro',
      },
      {
        titulo: 'Gestão de Custos',
        descricao: `Os custos fixos totalizam R$ ${summaryCards[2]?.value.replace('R$ ', '').replace('.', '') || '0'}, ${Number(summaryCards[2]?.change.replace(/[^0-9-]/g, '')) > 0 ? 'representando um aumento' : 'representando uma redução'} de ${Math.abs(Number(summaryCards[2]?.change.replace(/[^0-9-]/g, ''))) || '0'}% em relação ao período anterior. A otimização indica gestão disciplinada de recursos.`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: 'neutro',
      },
      {
        titulo: 'Runway Operacional',
        descricao: `Com reservas atuais de R$ ${summaryCards[0]?.value.replace('R$ ', '').replace('.', '') || '0'}, o caixa atual sustenta ${Math.floor(
          parseFloat(summaryCards[0]?.value.replace(/[R$\s.]/g, '') || '0') / saidaTotal
        )} meses de operações. Este período de folga oferece margem para decisões estratégicas e investimento em crescimento.`,
        data: new Date().toLocaleDateString('pt-BR'),
        tipo:
          parseFloat(summaryCards[0]?.value.replace(/[R$\s.]/g, '') || '0') / saidaTotal > 6
            ? 'positivo'
            : 'neutro',
      },
    ];
  }, [transactions, summaryCards]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">Inteligência</span>
          <h1>Narrativas</h1>
          <p>Análises automatizadas baseadas nos seus dados</p>
        </div>
      </header>

      <div className="narrativas-list">
        {narrativas.map((narrativa, index) => (
          <article key={index} className={`narrativa-card narrativa-card--${narrativa.tipo}`}>
            <div className="narrativa-header">
              <h2>{narrativa.titulo}</h2>
              <time>{formatDate(narrativa.data)}</time>
            </div>
            <p className="narrativa-text">{narrativa.descricao}</p>
            <div className="narrativa-footer">
              <span className={`narrativa-badge narrativa-badge--${narrativa.tipo}`}>
                {narrativa.tipo === 'positivo'
                  ? '↑ Positivo'
                  : narrativa.tipo === 'negativo'
                  ? '↓ Atenção'
                  : '→ Informativo'}
              </span>
              <button className="narrativa-copy" onClick={() => navigator.clipboard.writeText(narrativa.descricao)}>
                📋 Copiar
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="narrativas-tip">
        <h2>💡 Dica</h2>
        <p>
          As narrativas são geradas automaticamente baseadas nos seus dados financeiros.
          Você pode copiar qualquer narrativa e colá-la em relatórios ou compartilhá-la com sua equipe.
        </p>
      </section>
    </div>
  );
}