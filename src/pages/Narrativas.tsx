import { useMemo } from 'react';
import { useFinanceStore } from '../context/store';
import { useAdvancedMetrics } from '../utils/advancedMetrics';
import { formatBRL } from '../utils/money';

export default function Narrativas() {
  const { transactions } = useFinanceStore();
  const metrics = useAdvancedMetrics(transactions);

  const narrativas = useMemo(() => {
    const { totalReceita, totalDespesa, saldo, economiaTaxa, maiorDespesa, diasSobrevivência, tendencia } = metrics;

    const taxa = totalReceita > 0 ? (totalDespesa / totalReceita) * 100 : 0;

    const tendenciaTexto =
      tendencia === 'alta'
        ? 'em alta: o custo mensal médio vem crescendo e merece atenção'
        : tendencia === 'baixa'
        ? 'em queda: o custo mensal médio está diminuindo'
        : 'estável: o custo mensal médio se mantém consistente';

    return [
      {
        titulo: 'Performance de Caixa',
        descricao: `Neste período, registramos um volume total de entradas de ${formatBRL(totalReceita)}, com saídas de ${formatBRL(totalDespesa)}. O saldo líquido de ${formatBRL(saldo)} representa ${taxa.toFixed(1)}% das entradas sendo absorvido por custos e uma economia de ${economiaTaxa.toFixed(1)}% sobre a receita gerada.`,
        data: new Date().toISOString(),
        tipo: saldo >= 0 ? 'positivo' : 'negativo',
      },
      {
        titulo: 'Composição de Receitas',
        descricao: `As entradas somam ${formatBRL(totalReceita)} no período analisado, com recorrência distribuída entre salários e projetos. Manter fontes recorrentes reduz a dependência de receita variável e fortalece a previsibilidade operacional.`,
        data: new Date().toISOString(),
        tipo: 'neutro',
      },
      {
        titulo: 'Gestão de Custos',
        descricao: maiorDespesa
          ? `A maior despesa do período foi "${maiorDespesa.name}" com ${formatBRL(maiorDespesa.value)}. A trajetória dos custos está ${tendenciaTexto}. Revisar as categorias de maior peso é a alavanca com maior retorno imediato.`
          : 'Nenhuma despesa registrada no período analisado.',
        data: new Date().toISOString(),
        tipo: maiorDespesa && maiorDespesa.value > totalDespesa * 0.4 ? 'negativo' : 'neutro',
      },
      {
        titulo: 'Runway Operacional',
        descricao: `Com caixa líquido de ${formatBRL(saldo)}, a operação se sustenta por aproximadamente ${diasSobrevivência} dias sem novas entradas. Este período de folga oferece margem para decisões estratégicas e investimento em crescimento.`,
        data: new Date().toISOString(),
        tipo: diasSobrevivência > 180 ? 'positivo' : 'neutro',
      },
    ];
  }, [metrics]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
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
              <button
                className="narrativa-copy"
                onClick={() => navigator.clipboard.writeText(narrativa.descricao)}
              >
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