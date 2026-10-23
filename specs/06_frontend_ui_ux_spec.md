# SPEC-06: Frontend UI/UX & Component Architecture Specification

> **Design Tokens, Monochromatic Titanium + Electric Mint Visual Language, React 18 Tree, and Spatial Layering**

---

## 1. Design System & Craft Philosophy

Querify employs a bespoke, high-craft developer tool visual identity inspired by Linear, Raycast, and Stripe Radar. It eschews generic AI templates, purple glows, and heavy glassmorphism in favor of monochromatic titanium tones, dark obsidian surfaces, and a single signature brand accent: **Intelligent Electric Mint (`#00F5A0`)**.

```
+-----------------------------------------------------------------------------------+
|                              COLOR PALETTE TOKENS                                 |
+-----------------------------------------------------------------------------------+
|  Deep Obsidian        |  #06080D  | Root canvas and body backdrop                 |
|  Elevated Graphite    |  #0A0E17  | Card surfaces & command consoles             |
|  Panel Surface        |  #0F1523  | Toolbar bars & elevated flyouts              |
|  Card Container       |  #131B2A  | Active selection cards & table rows          |
|  Titanium Border      |  #1C2638  | Subtle structural dividers (80% opacity)     |
|  Active Brand Accent  |  #00F5A0  | Primary CTAs, active pills, SQL keywords     |
|  Brand Hover State    |  #00DF89  | Interactive button hover state               |
|  Brand Subtle Glow    |  #00F5A0  | Soft 15px box-shadow under active elements   |
|  Text Primary         |  #F8FAFC  | High-contrast crisp white typography         |
|  Text Muted           |  #94A3B8  | Technical metadata & secondary labels        |
|  Ambiguity Warning    |  #F59E0B  | Amber warning indicators for polysemy        |
+-----------------------------------------------------------------------------------+
```

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
