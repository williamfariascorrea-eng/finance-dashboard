# Finance Dashboard - Atlas Capital

Dashboard financeiro corporativo moderno e completo, desenvolvido com React, TypeScript e Vite.

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Status](https://img.shields.io/badge/Status-Online-green)

## funcionalidades

- **Dashboard Principal**: Visão geral com métricas, gráficos e transações
- **Fluxo de Caixa**: Tabela mensal detalhada com expansão de detalhes
- **Planejamento**: Projeções financeiras e alertas automáticos
- **Narrativas**: Análises automatizadas baseadas nos dados
- **Ajustes**: Configurações, tema e exportação de dados
- **Busca**: Filtragem em tempo real por nome ou categoria
- **Filtros de Período**: 30 dias, 90 dias, ano atual
- **Adicionar Transação**: Modal para novas entradas/saídas
- **Modo Escuro**: Alternância de tema
- **Persistência**: Dados salvos no localStorage
- **Exportação**: JSON e CSV

## Tech Stack

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build**: Vite
- **Estado**: Zustand
- **Roteamento**: React Router
- **Estilos**: CSS Modules + CSS Variables
- **Testes**: Vitest + Testing Library

## Começando

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test

# Lint
npm run lint
```

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── context/       # Zustand stores
├── data/          # Dados mock
├── pages/         # Páginas routeadas
├── styles/        # CSS global
├── types/         # Tipos TypeScript
└── __tests__/    # Testes
```

## Screenshots

O projeto inclui:
- Design moderno com gradientes e efeitos de glassmorphism
-Modo claro e escuro
- GráficosSVG personalizados
- Interface responsiva

## Licença

MIT © William Corrêa