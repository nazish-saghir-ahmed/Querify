# SPEC-06: Frontend UI/UX & Component Architecture Specification

> **Design Tokens, Cyberpunk Visual Language, React 18 Component Tree, and Error Boundary Systems**

---

## 1. Design System & Cyberpunk Aesthetic

Querify employs a dark cyberpunk / glassmorphic visual language engineered for high legibility, analytical precision, and visual impact.

```
+-----------------------------------------------------------------------------------+
|                              COLOR PALETTE TOKENS                                 |
+-----------------------------------------------------------------------------------+
|  Deep Background      |  #080B14  | Primary body & canvas background              |
|  Surface Card         |  #0B1120  | Component card containers with glass blur    |
|  Surface Elevated     |  #111827  | Modals, active tabs, and flyout menus        |
|  Cyan Accent (Neon)   |  #06B6D4  | Primary CTAs, active highlights, links       |
|  Indigo Accent        |  #6366F1  | Secondary gradients, SQL keywords            |
|  Emerald Accent       |  #10B981  | Success badges, execution durations          |
|  Rose Accent (Alert)  |  #F43F5E  | Error boundaries, AST rejection badges       |
|  Border Subdued       |  #1E293B  | Subtle card borders with 80% opacity         |
+-----------------------------------------------------------------------------------+
```

### Typography Tokens
- **Display & Interface**: `Inter`, `-apple-system`, `sans-serif` (balanced geometry, high legibility).
- **Code & SQL**: `JetBrains Mono`, `Fira Code`, `monospace` (ligature support, tabular figures for currency and row metrics).

---

## 2. Component Hierarchy Tree

```
App.jsx (Root State & Tab Navigation: 'workspace' | 'explorer' | 'history' | 'about')
 └── ErrorBoundary.jsx (Global Exception Interceptor)
      ├── Navbar.jsx (Logo, Active Tab Pills, Engine Mode Badge, GitHub Link)
      │    └── BrandLogo.jsx (Cyan/Indigo SVG Glyph)
      │
      ├── Page Container (Conditional View Rendering)
      │    ├── WorkspacePage.jsx (Natural Language Text-to-SQL Workflow)
      │    │    ├── QuestionChip.jsx (Pre-built prompt chips)
      │    │    ├── ClarificationModal.jsx (Multi-turn choice dialog)
      │    │    ├── SqlViewer.jsx (Syntax highlighted SQL + Explain accordion)
      │    │    ├── ResultTable.jsx (Paginated results + CSV Export)
      │    │    └── ResultChart.jsx (Dynamic Recharts Bar/Line/Pie)
      │    │
      │    ├── ExplorerPage.jsx (Multi-Domain Schema Browser)
      │    │    ├── Domain Selector Tabs (ecommerce, saas, hr, fintech)
      │    │    ├── Table Filter & Search Input
      │    │    ├── Table Card Grid (Columns, Data Types, PK/FK Badges)
      │    │    └── Sample Data Drawer (First 5 records with header metadata)
      │    │
      │    ├── HistoryPage.jsx (Query Execution Audit Logs)
      │    │    ├── KPI Cards (Total Queries, Avg Latency, Success Rate)
      │    │    ├── Search & Status Filter Bar
      │    │    └── Audit Log Table (Prompt, SQL, Duration, Timestamp)
      │    │
      │    └── AboutPage.jsx (Architecture, Pipeline, & Viva Defense Guide)
      │
      └── Footer.jsx (Copyright, GitHub Link, Vercel Status Badge)
```

---

## 3. Dynamic Data Visualization Specs (`ResultChart.jsx`)

Querify inspects query results and automatically recommends the optimal Recharts visualization based on data shape:

```
[ Query Result Dataset ]
           |
           +---> Multiple continuous years/dates? ---> Render <LineChart />
           |
           +---> 1 categorical text column + 1 numeric column? ---> Render <BarChart />
           |
           +---> Proportional breakdown (<= 5 categories)? ---> Render <PieChart />
           |
           +---> High-dimensional multi-column data? ---> Render <ResultTable /> only
```

- **Responsive Container**: Wrapped in `<ResponsiveContainer width="100%" height={320}>`.
- **Cyberpunk Gradients**: Linear gradients applied to SVG bars and line paths (`#06B6D4` to `#6366F1`).
- **Interactive Tooltips**: Custom glassmorphic tooltip displaying exact numbers with formatted currency symbols (`$M` / `$B`).

---

## 4. Error Boundary Architecture (`ErrorBoundary.jsx`)

To ensure the application never displays a blank or dark screen, `<App />` is wrapped inside `ErrorBoundary.jsx`:

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Querify ErrorBoundary] Uncaught component exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0B1120] border border-rose-500/30 rounded-2xl p-8 text-center shadow-2xl">
            {/* Branded Recovery UI with 'Reload App' button */}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Key Recovery Features
1. **Zero Unmounting**: The UI catches any exception in child components before the DOM collapses.
2. **Interactive Recovery**: Provides a 1-click **"Reload App"** button (`window.location.reload()`).
3. **Diagnostic Details**: Collapsible diagnostic drawer showing error stack trace for debugging.
4. **Theme Preservation**: Retains the brand's dark aesthetic without jarring white error pages.
