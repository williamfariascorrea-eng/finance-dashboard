export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
};

export const sanitizeAmount = (input: string): number => {
  if (!input) return 0;
  const cleaned = input.replace(/[R$\s.]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.abs(parsed);
};

export const sanitizeDate = (input: string): string => {
  const dateRegex = /^(\d{1,2}\s+\w+\s+\d{4})$/;
  if (!dateRegex.test(input)) {
    return new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return input;
};

export const formatCurrencyInput = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  if (!numeric) return '';
  const formatted = (parseInt(numeric) / 100).toFixed(2);
  return formatted.replace('.', ',');
};

export const validateTransaction = (data: {
  name?: string;
  amount?: string;
  date?: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || sanitizeString(data.name).length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!data.amount || sanitizeAmount(data.amount) <= 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!data.date) {
    errors.push('Data é obrigatória');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateBudget = (data: {
  category: string;
  limit: number;
  spent: number;
}): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  const percentage = (data.spent / data.limit) * 100;

  if (percentage >= 100) {
    warnings.push(`Orçamento excedido em ${Math.round(percentage - 100)}%`);
  } else if (percentage >= 80) {
    warnings.push(`Orçamento com ${Math.round(100 - percentage)}% restante`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};