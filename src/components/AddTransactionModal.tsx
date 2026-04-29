import { useState } from 'react';
import { useFinanceStore } from '../context/store';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIAS = [
  'Entrada fixa',
  'Projeto',
  'Servicos',
  'Operacional',
  'Ferramentas',
  'Marketing',
  'Infraestrutura',
  'Outros',
];

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useFinanceStore();
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Entrada fixa');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Nome e obrigatorio');
      return;
    }

    if (!amount.trim()) {
      setErro('Valor e obrigatorio');
      return;
    }

    if (!date.trim()) {
      setErro('Data e obrigatoria');
      return;
    }

    const formattedAmount = `${tipo === 'entrada' ? '+' : '-'}R$ ${parseFloat(amount.replace(/[R$\s.]/g, '')).toLocaleString('pt-BR')}`;
    const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'short' });
    const anoAtual = new Date().getFullYear();
    const formattedDate = date.includes(mesAtual) ? date : `${mesAtual} ${anoAtual}`;

    addTransaction({
      name: nome,
      category: categoria,
      type: tipo,
      amount: formattedAmount,
      date: formattedDate,
    });

    setNome('');
    setAmount('');
    setDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Nova Transacao</h2>
          <button className="modal__close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Salario, Aluguel, Freelance"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <div className="form-group__tipo">
              <button
                type="button"
                className={`tipo-btn ${tipo === 'entrada' ? 'tipo-btn--entrada' : ''}`}
                onClick={() => setTipo('entrada')}
              >
                Entrada
              </button>
              <button
                type="button"
                className={`tipo-btn ${tipo === 'saida' ? 'tipo-btn--saida' : ''}`}
                onClick={() => setTipo('saida')}
              >
                Saida
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Valor</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ex: 15 Abr 2026"
            />
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}