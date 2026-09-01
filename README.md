# Atlas Capital — Finance Dashboard

A modern corporate finance dashboard built with **React, TypeScript, and Vite**. Track cash flow, plan budgets, read automated financial narratives, and export your data — all in a polished, responsive interface with light and dark themes.

![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4.5-white?style=flat&logo=stateful)
![Status](https://img.shields.io/badge/Status-Online-22c55e)

> ⚠️ *This is a front-end demo using mock data stored in `localStorage`. It is not connected to a real bank account or API.*

## ✨ Features

- **Dashboard overview** — key financial metrics, charts and recent transactions at a glance
- **Cash flow** — month-by-month table with expandable detail rows
- **Financial planning** — projections and automatic alerts
- **Narratives** — auto-generated plain-language analysis of your numbers
- **Settings** — theme, data management and export
- **Real-time search** — filter transactions by name or category
- **Date filters** — 30 days, 90 days or current year
- **Add/remove transactions** — accessible modal form with validation
- **Dark / light theme** — persisted across sessions
- **Data persistence** — everything saved in `localStorage`
- **Export** — download data as **JSON** or **CSV**

## 🛠 Tech Stack

| Concern     | Tool                          |
|-------------|-------------------------------|
| Framework   | React 18                      |
| Language    | TypeScript 5.4                |
| Build tool  | Vite                          |
| State       | Zustand (with `persist` middleware) |
| Routing     | React Router                  |
| Styling     | CSS Modules + CSS variables   |
| Testing     | Vitest + Testing Library      |
| Linting     | ESLint (a11y + React hooks)   |
| Export      | jsPDF, JSON, CSV              |

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Production build
npm run build

# 4. Run tests
npm test

# 5. Lint and typecheck
npm run lint
npm run typecheck
```

## 📁 Project Structure

```
src/
├── __tests__/   # Unit tests (Vitest)
├── components/  # Reusable UI components
├── context/     # Zustand stores + theme context
├── data/        # Mock data
├── pages/       # Routed pages (Dashboard, Fluxo, ...)
├── styles/      # Global CSS
├── types/       # Shared TypeScript types
└── utils/       # Validation, metrics, logging, PDF export
```

## ✅ Quality Gates

This project runs clean through:

- `npm run typecheck` — **0 errors**
- `npm run lint` — **0 errors** (incl. accessibility rules)
- `npm run test` — **6/6 passing** (store unit tests)
- `npm run build` — production bundle

## 🔗 Live Demo

[finance-dashboard-jqhp.onrender.com](https://finance-dashboard-jqhp.onrender.com/)

## 📄 License

MIT © William Corrêa