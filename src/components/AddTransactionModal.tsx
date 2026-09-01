import { useState, useCallback } from 'react';
import { useFinanceStore } from '../context/store';
import { validateTransaction, sanitizeAmount, formatCurrencyInput } from '../utils/validation';
import { toISODate } from '../utils/money';

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
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation = validateTransaction({
      name: nome,
      amount: amount,
      date: date,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const numericValue = sanitizeAmount(amount);

    addTransaction({
      name: nome,
      category: categoria,
      type: tipo,
      amount: numericValue,
      date: date || toISODate(new Date()),
    });

    setNome('');
    setAmount('');
    setDate('');
    onClose();
  }, [nome, amount, date, categoria, tipo, addTransaction, onClose]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      setAmount(formatCurrencyInput(value));
    } else {
      setAmount('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Nova transação">
        <div className="modal__header">
          <h2>NOVA TRANSAÇÃO</h2>
          <button className="modal__close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form-group">
            <label htmlFor="nome">DESCRIÇÃO</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Salário, Freelance"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">CATEGORIA</label>
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
            <span id="tipo-label" className="form-label">TIPO</span>
            <div className="form-group__tipo" role="radiogroup" aria-labelledby="tipo-label">
              <button
                type="button"
                className={`tipo-btn ${tipo === 'entrada' ? 'tipo-btn--entrada' : ''}`}
                onClick={() => setTipo('entrada')}
              >
                ENTRADA
              </button>
              <button
                type="button"
                className={`tipo-btn ${tipo === 'saida' ? 'tipo-btn--saida' : ''}`}
                onClick={() => setTipo('saida')}
              >
                SAÍDA
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">VALOR</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">DATA</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {errors.length > 0 && (
            <div className="form-errors">
              {errors.map((err, i) => (
                <p key={i} className="form-error">• {err}</p>
              ))}
            </div>
          )}

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              CANCELAR
            </button>
            <button type="submit" className="btn-primary">
              ADICIONAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}