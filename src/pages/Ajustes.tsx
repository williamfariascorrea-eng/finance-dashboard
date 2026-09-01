import { useState } from 'react';
import { useFinanceStore } from '../context/store';
import { buildMonthlyExpenses, buildSummaryCards } from '../utils/metrics';

export default function Ajustes() {
  const { theme, setTheme } = useFinanceStore();
  const [salvo, setSalvo] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'paper' ? 'night' : 'paper');
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const exportarDados = () => {
    const { transactions } = useFinanceStore.getState();

    const dados = {
      exportadoEm: new Date().toISOString(),
      transacoes: transactions,
      cartoes: buildSummaryCards(transactions),
      despesasMensais: buildMonthlyExpenses(transactions),
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-capital-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const exportarCSV = () => {
    const { transactions } = useFinanceStore.getState();
    
    const headers = ['ID', 'Nome', 'Categoria', 'Tipo', 'Valor', 'Data'];
    const rows = transactions.map(t => [
      t.id,
      t.name,
      t.category,
      t.type,
      t.amount,
      t.date,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-capital-transacoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const limparDados = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('atlas-finance');
      window.location.reload();
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">Sistema</span>
          <h1>Ajustes</h1>
          <p>Configurações e controles do sistema</p>
        </div>
      </header>

      <section className="settings-section">
        <h2>Aparência</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <strong>Tema</strong>
              <p>Alternar entre modo claro e escuro</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`settings-toggle ${theme === 'night' ? 'active' : ''}`}
            >
              {theme === 'paper' ? '☀️ Claro' : '🌙 Escuro'}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Dados</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <strong>Exportar JSON</strong>
              <p>Baixar todos os dados em formato JSON</p>
            </div>
            <button onClick={exportarDados} className="settings-button">
              📥 Baixar JSON
            </button>
          </div>
          
          <div className="settings-divider" />
          
          <div className="settings-row">
            <div>
              <strong>Exportar CSV</strong>
              <p>Baixar transações em planilha</p>
            </div>
            <button onClick={exportarCSV} className="settings-button">
              📊 Baixar CSV
            </button>
          </div>
          
          <div className="settings-divider" />
          
          <div className="settings-row">
            <div>
              <strong>Limpar Dados</strong>
              <p>Remover todos os dados salvos localmente</p>
            </div>
            <button onClick={limparDados} className="settings-button settings-button--danger">
              🗑️ Limpar
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Sobre</h2>
        <div className="settings-card">
          <div className="settings-about">
            <strong>Atlas Capital</strong>
            <p>Dashboard financeiro corporativo</p>
            <span className="settings-version">Versão 1.0.0</span>
          </div>
        </div>
      </section>

      {salvo && (
        <div className="toast-success">
          ✅ Operação realizada com sucesso!
        </div>
      )}
    </div>
  );
}