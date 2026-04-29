import { describe, it, expect, beforeEach } from 'vitest';
import { useFinanceStore } from '../context/store';

describe('useFinanceStore', () => {
  beforeEach(() => {
    useFinanceStore.setState({ theme: 'paper', filter: 'all', searchQuery: '' });
  });

  it('should have initial filter state as all', () => {
    expect(useFinanceStore.getState().filter).toBe('all');
  });

  it('should have initial theme as paper', () => {
    expect(useFinanceStore.getState().theme).toBe('paper');
  });

  it('should toggle theme from paper to night', () => {
    const { toggleTheme } = useFinanceStore.getState();
    toggleTheme();
    expect(useFinanceStore.getState().theme).toBe('night');
  });

  it('should set search query', () => {
    const { setSearchQuery } = useFinanceStore.getState();
    setSearchQuery('test query');
    expect(useFinanceStore.getState().searchQuery).toBe('test query');
  });

  it('should set filter to entrada', () => {
    const { setFilter } = useFinanceStore.getState();
    setFilter('entrada');
    expect(useFinanceStore.getState().filter).toBe('entrada');
  });

  it('should set filter to saida', () => {
    const { setFilter } = useFinanceStore.getState();
    setFilter('saida');
    expect(useFinanceStore.getState().filter).toBe('saida');
  });
});