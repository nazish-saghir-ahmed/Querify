# SPEC-06: Frontend UI/UX & Component Architecture Specification

> **Design Tokens, Dark Navy Blue Palette with Transparent Frosted Glass Architecture, React 18 Tree, and Metric-Aware Visualization**

---

## 1. Design System & Craft Philosophy

Querify employs a bespoke, high-craft developer tool visual identity designed for high-assurance database technology and enterprise financial applications. It pairs rich **Dark Navy Blue (`#1D3557`, `#14253D`, `#2B4C7E`)** with deep navy canvas (`#0D1B2A`), prestigious **Royal Gold (`#D4AF37`)**, and warm **Royal Champagne Ivory (`#F7F3E9`)** typography, enveloped in transparent frosted glass containers (`backdrop-blur-xl`).

```
+-----------------------------------------------------------------------------------+
|                              COLOR PALETTE TOKENS                                 |
+-----------------------------------------------------------------------------------+
|  Deep Royal Canvas    |  #0D1B2A  | Root body backdrop and terminal foundation    |
|  Dark Navy Brand      |  #1D3557  | Primary action buttons, tabs, accent borders  |
|  Navy Brand Hover     |  #14253D  | Hover state for buttons and active items      |
|  Navy Brand Slate     |  #2B4C7E  | Secondary containers, table header highlights |
|  Steel Navy Border    |  #3A506B  | Structural glass borders (30-40% opacity)     |
|  Prestigious Gold     |  #D4AF37  | Ambiguity alerts, SQL keywords, PK badges     |
|  Champagne Ivory Text |  #F7F3E9  | High-contrast crisp warm white typography     |
|  Muted Slate Text     |  #94A3B8  | Technical metadata & secondary labels         |
+-----------------------------------------------------------------------------------+
```

### Transparent Frosted Glass Containers
All interactive boxes, terminal windows, query composers, and cards utilize multi-layered glassmorphism:
- **Outer Shell (`.glass-royal`)**: `background: rgba(13, 27, 42, 0.65)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(58, 80, 107, 0.40)`.
- **Inner Nested Blocks (`.glass-royal-inner`)**: `background: rgba(27, 38, 59, 0.40)`, `backdrop-filter: blur(14px)`, `border: 1px solid rgba(58, 80, 107, 0.30)`.
- **Active State (`.glass-royal-active`)**: `background: rgba(29, 53, 87, 0.35)`, `backdrop-filter: blur(18px)`, `border: 1px solid rgba(43, 76, 126, 0.80)`.
- **Gold Ambiguity Alert (`.glass-gold-active`)**: `background: rgba(212, 175, 55, 0.15)`, `border: 1px solid rgba(212, 175, 55, 0.50)`.

### Typography Tokens
- **Display & Interface**: `Inter`, `-apple-system`, `sans-serif` (balanced geometry, high legibility).
- **Code, Dialect & SQL**: `JetBrains Mono`, `Fira Code`, `monospace` (ligature support, tabular figures for currency and row metrics).

---

## 2. Component Hierarchy Tree

```
App.jsx (Root Shell & View Router)
 ├── FixedHeroBackground.jsx (Ultra-HD Stationary AI + Relational DB Spatial Layer)
 ├── CursorTrail.jsx (Lightweight Canvas-based Electric Mint Particle Stream)
 ├── Navbar.jsx (Logo, Active Tab Pills, Live Engine Badge, Launch CTA)
 │    └── BrandLogo.jsx (Geometric Database Stack + Neural Diamond Glyph)
 │
 ├── Page Container (Foreground Scrolling Views)
 │    ├── LandingPage.jsx (Overview Hero, Interactive Terminal Window, Feature Cards)
 │    │    └── Sample Question Chips (Monospace prompts with AMBIGUOUS badges)
 │    │
 │    ├── WorkspacePage.jsx (Command Console Query Composer)
 │    │    ├── Console Header (Schema: querify_db • Dialect: MySQL 8 • AST Guard)
 │    │    ├── Command Input Chamber (>_ prompt with auto-expand & clear button)
 │    │    ├── ClarificationModal.jsx (Targeted disambiguation decision dialog)
 │    │    ├── SqlViewer.jsx (Syntax-highlighted SQL + Plain English query logic)
 │    │    ├── ResultTable.jsx (Paginated results + CSV Export)
 │    │    └── ResultChart.jsx (Dynamic Recharts Bar/Line/Pie with Electric Mint palette)
 │    │
 │    ├── ExplorerPage.jsx (Database Schema Explorer)
 │    │    ├── Table Search Filter Input (Live column & table search)
 │    │    ├── Domain Tables Sidebar (Row counts & selected state indicator)
 │    │    ├── Subtab 1: Columns & Data Types (Data types, PK/FK badges)
 │    │    ├── Subtab 2: Live Sample Records (Verified sample rows)
 │    │    └── Subtab 3: Relational Schema Topology (Interactive ERD Diagram)
 │    │
 │    ├── HistoryPage.jsx (Query Audit Trail)
 │    │    ├── KPI Cards (Total Executions, Avg Latency, AST Pass 100%)
 │    │    ├── Audit Search Bar (Filter by query text, SQL keywords, or date)
 │    │    └── Audit Log Cards (Copy SQL, Re-run in Workspace, latency chips)
 │    │
 │    └── AboutPage.jsx (Architecture Pipeline & 20+ Viva Voce Guide)
 │
 └── Footer.jsx (Platform Navigation, Architecture links, Copyright)
```
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
- **Dark Navy & Gold Palette**: Visual styles using Dark Navy tones (`#1D3557`, `#2B4C7E`, `#3A506B`, `#7FA1C3`) and prestigious Gold (`#D4AF37`).
- **Interactive Tooltips**: Custom frosted glass tooltip displaying exact numbers with formatted currency symbols (`$M` / `$B`) or percentage (`%`).
- **Resilient Axis Mapping**: Resolves categorical keys via `company_name` or first string column to ensure charts never render with blank axes.

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
        <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#1B263B]/80 border border-rose-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
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

---

## 5. Company Name Normalization & Metric Formatting Rules

### 5.1 Case-Insensitive Relational Accessors
To prevent table rows and charts from rendering company names as `null` or `undefined` when database metadata uses varied casing (`COMPANY_NAME` vs `company_name`) or table qualifiers (`c.company_name`):
```javascript
const getRowValue = (row, col) => {
  if (!row) return undefined;
  if (row[col] !== undefined) return row[col];
  const lower = col.toLowerCase();
  for (const k of Object.keys(row)) {
    if (k.toLowerCase() === lower || k.toLowerCase().endsWith('.' + lower)) {
      return row[k];
    }
  }
  return undefined;
};
```

### 5.2 Metric-First Cell Value Formatting
In `ResultTable.jsx`, percentage metrics must be distinguished from currency metrics before substring checking:
```javascript
const formatCellValue = (val, colName = '') => {
  if (val == null) return <span className="text-slate-600 italic">null</span>;
  const lower = colName.toLowerCase();
  
  // Percentages MUST be checked before general numeric/currency keywords
  if (lower.includes('percent') || lower.includes('growth') || lower.includes('share') || lower.includes('rate') || lower.includes('margin') || lower.includes('roi')) {
    return `${Number(val).toFixed(2)}%`;
  }
  
  // Currency values ($M or $B)
  if (lower.includes('revenue') || lower.includes('income') || lower.includes('spending') || lower.includes('amount') || lower.includes('valuation') || lower.includes('price')) {
    return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`;
  }
  
  if (typeof val === 'number') return val.toLocaleString();
  return String(val);
};
```
