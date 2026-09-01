import { auditLogger } from './auditLogger';
import { formatBRL } from './money';

export const generatePDFReport = async (data: {
  transactions: Array<{
    id: number;
    name: string;
    category: string;
    type: string;
    amount: number;
    date: string;
  }>;
  summary: {
    totalEntrada: number;
    totalSaida: number;
    saldo: number;
  };
  period: string;
}): Promise<void> => {
  const printContent = `
<html>
<head>
  <title>Relatório Financeiro - Atlas Capital</title>
  <style>
    body { font-family: 'Courier New', monospace; padding: 40px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 24px 0 12px; border-bottom: 2px solid #000; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ccc; }
    th { background: #f0f0f0; font-weight: bold; }
    .positive { color: #16a34a; }
    .negative { color: #dc2626; }
    .summary { display: flex; gap: 24px; margin: 24px 0; }
    .summary-box { flex: 1; padding: 16px; border: 2px solid #000; }
    .summary-box strong { display: block; font-size: 24px; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>RELATÓRIO FINANCEIRO</h1>
  <p>Atlas Capital | Período: ${data.period}</p>
  <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>

  <div class="summary">
    <div class="summary-box">
      <span>Total Entradas</span>
      <strong class="positive">${formatBRL(data.summary.totalEntrada)}</strong>
    </div>
    <div class="summary-box">
      <span>Total Saídas</span>
      <strong class="negative">${formatBRL(data.summary.totalSaida)}</strong>
    </div>
    <div class="summary-box">
      <span>Saldo</span>
      <strong class="${data.summary.saldo >= 0 ? 'positive' : 'negative'}">
        ${formatBRL(data.summary.saldo)}
      </strong>
    </div>
  </div>

  <h2>TRANSAÇÕES</h2>
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Descrição</th>
        <th>Categoria</th>
        <th>Tipo</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      ${data.transactions
        .map(
          (t) => `
        <tr>
          <td>${t.date}</td>
          <td>${t.name}</td>
          <td>${t.category}</td>
          <td class="${t.type === 'entrada' ? 'positive' : 'negative'}">${t.type}</td>
          <td class="${t.type === 'entrada' ? 'positive' : 'negative'}">${formatBRL(t.amount)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Atlas Capital Dashboard | Desenvolvido por William Corrêa</p>
    <p> Sistema de gestão financeira pessoal</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  auditLogger.success('EXPORT_PDF', `Relatório PDF gerado para período ${data.period}`);
};