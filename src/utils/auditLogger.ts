export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  action: string;
  details: string;
  user?: string;
}

class AuditLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  log(level: LogLevel, action: string, details: string, user?: string): void {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      action,
      details,
      user,
    };

    this.logs.unshift(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    if (level === 'error') {
      console.error(`[AUDIT] ${action}:`, details);
    }
  }

  info(action: string, details: string, user?: string): void {
    this.log('info', action, details, user);
  }

  success(action: string, details: string, user?: string): void {
    this.log('success', action, details, user);
  }

  warning(action: string, details: string, user?: string): void {
    this.log('warning', action, details, user);
  }

  error(action: string, details: string, user?: string): void {
    this.log('error', action, details, user);
  }

  getLogs(limit?: number): LogEntry[] {
    return limit ? this.logs.slice(0, limit) : this.logs;
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByAction(action: string): LogEntry[] {
    return this.logs.filter(log => log.action === action);
  }

  clear(): void {
    this.logs = [];
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const auditLogger = new AuditLogger();

export const logTransactionAdded = (transactionName: string, amount: string) => {
  auditLogger.success('ADD_TRANSACTION', `Nova transação: ${transactionName} - ${amount}`);
};

export const logTransactionRemoved = (transactionId: number, transactionName: string) => {
  auditLogger.info('REMOVE_TRANSACTION', `Removida transação ID ${transactionId}: ${transactionName}`);
};

export const logThemeChanged = (fromTheme: string, toTheme: string) => {
  auditLogger.info('THEME_CHANGE', `Tema alterado de ${fromTheme} para ${toTheme}`);
};

export const logDataExported = (format: string) => {
  auditLogger.info('EXPORT_DATA', `Dados exportados em formato ${format}`);
};

export const logBudgetExceeded = (category: string, percentage: number) => {
  auditLogger.warning('BUDGET_EXCEEDED', `Categoria ${category} excedeu em ${percentage}%`);
};

export const logAppStarted = () => {
  auditLogger.info('APP_START', 'Aplicação iniciada');
};