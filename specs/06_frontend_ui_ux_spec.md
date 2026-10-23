# SPEC-06: Frontend UI/UX & Component Architecture Specification

> **Design Tokens, Royal Navy & Gold Palette with Royal Blue Accents, Transparent Frosted Glass Architecture, React 18 Tree, and Spatial Layering**

---

## 1. Design System & Craft Philosophy

Querify employs a bespoke, high-craft developer tool visual identity designed for high-assurance database technology and enterprise financial brands. It pairs deep **Royal Navy (`#0D1B2A`, `#1B263B`)** with **Royal Blue (`#2563EB`, `#3B82F6`)**, prestigious **Royal Gold (`#D4AF37`)**, and warm **Royal Champagne Ivory (`#F7F3E9`)** typography, enveloped in transparent frosted glass containers (`backdrop-blur-xl`).

```
+-----------------------------------------------------------------------------------+
|                              COLOR PALETTE TOKENS                                 |
+-----------------------------------------------------------------------------------+
|  Deep Royal Navy      |  #0D1B2A  | Root canvas and body backdrop                 |
|  Elevated Royal Slate |  #1B263B  | Transparent card surfaces (40-70% opacity)    |
|  Steel Blue Border    |  #415A77  | Subtle structural dividers (30-40% opacity)   |
|  Royal Blue Brand     |  #2563EB  | Primary CTAs, active pills, SQL identifiers   |
|  Electric Royal Blue  |  #3B82F6  | Hover states & active glow indicators         |
|  Prestigious Gold     |  #D4AF37  | Ambiguity alerts, SQL keywords, PK badges     |
|  Champagne Ivory Text |  #F7F3E9  | High-contrast crisp warm white typography     |
|  Muted Slate Text     |  #94A3B8  | Technical metadata & secondary labels         |
+-----------------------------------------------------------------------------------+
```

### Transparent Frosted Glass Containers
All interactive boxes, terminal windows, query composers, and cards utilize multi-layered glassmorphism:
- **Outer Shell (`.glass-royal`)**: `background: rgba(13, 27, 42, 0.65)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(65, 90, 119, 0.35)`.
- **Inner Nested Blocks (`.glass-royal-inner`)**: `background: rgba(27, 38, 59, 0.40)`, `backdrop-filter: blur(14px)`, `border: 1px solid rgba(65, 90, 119, 0.30)`.
- **Active State (`.glass-royal-active`)**: `background: rgba(37, 99, 235, 0.20)`, `backdrop-filter: blur(18px)`, `border: 1px solid rgba(59, 130, 246, 0.60)`.
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
