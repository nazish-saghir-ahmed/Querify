# Querify Frontend Application

**Framework:** React 18 + Vite 5  
**Styling:** Tailwind CSS (Futuristic Dark Theme)  
**Icons:** Lucide React  
**Charts:** Recharts  
**Port:** `5173`

---

## 1. Quick Start

Install dependencies:
```powershell
npm install
```

Start the Vite development server:
```powershell
npm run dev
```

The application will be available at:
`http://localhost:5173`

Build for production:
```powershell
npm run build
```

Preview production build:
```powershell
npm run preview
```

---

## 2. Reverse Proxy Configuration

During development, Vite automatically proxies all `/api` requests to the Spring Boot backend running on `http://localhost:8080`. This eliminates CORS configuration issues during local development.

Configured in `vite.config.js`:
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

---

## 3. Pages & Features

1. **`LandingPage.jsx`**: Animated product landing hero, product preview mockup, feature cards, and "How It Works" 4-step pipeline.
2. **`WorkspacePage.jsx`**: Primary Text-to-SQL workspace with natural language input bar, ambiguity clarification dialog, syntax-highlighted SQL viewer, data table, and charts.
3. **`ExplorerPage.jsx`**: Live schema inspector, table data explorer, column descriptions, and interactive Entity-Relationship Diagram (ERD).
4. **`HistoryPage.jsx`**: Executed query audit trail, execution timing, copy SQL, and re-run buttons.
5. **`AboutPage.jsx`**: Architecture, clarification algorithm, and 20+ university viva questions and answers.
