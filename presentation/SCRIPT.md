# Querify: Executive Presentation & Demonstration Script

> **Target Audience:** Professors, Viva Examiners, Technical Evaluators, or Executive Stakeholders  
> **Total Duration:** 3 to 4 Minutes (Punchy, High-Impact, Zero Theory Fluff)  
> **Slide Deck URL / File:** `presentation/index.html` (Double-click to open in any browser)  
> **Live App URL:** `https://querify-nine.vercel.app` (or local `http://localhost:5173`)

---

## Slide Navigation & Keyboard Shortcuts
- `→` / `Space`: Next Slide
- `←`: Previous Slide
- `S`: Toggle On-Screen Speaker Teleprompter Drawer

---

## 🎙️ Slide-by-Slide Script & Visual Cues

### Slide 1: The Industry Blind Spot (Why Naive Text-to-SQL Fails)
- **Time:** 40 seconds
- **On Screen:** Split comparison: Red card (Naive Guesswork) vs. Green card (Querify Clarification).
- **Spoken Script:**
  > "Good morning/afternoon. Today I am presenting **Querify**.
  > 
  > In enterprise data systems, Text-to-SQL is supposed to allow anyone to query databases in plain English. But traditional LLMs have a fatal blind spot: **they guess when questions are ambiguous.**
  > 
  > For example, if an executive asks: *'Show me the best performing AI companies'*, a standard LLM blindly assumes 'best' means revenue. It completely ignores net profit, revenue growth rate, or ROI. The user receives a confident answer that is fundamentally misleading.
  > 
  > Querify fixes this by replacing dangerous guesswork with a stateful **Clarification Engine** that halts execution, prompts the user for clarification, and guarantees deterministic truth."
- **Visual Cue:** *Point to the red card showing the LLM guessing, then point to the green card showing Querify's targeted options.*

---

### Slide 2: The Three Pillars of Querify
- **Time:** 35 seconds
- **On Screen:** 3 visual cards: Ambiguity Detection, AST Security Guard, Instant Visual Insights.
- **Spoken Script:**
  > "Querify solves this through three core architectural pillars:
  > 
  > 1. **Semantic Ambiguity Detection:** Our engine analyzes polysemous business vocabulary like *'best'*, *'top'*, or *'money'*, halting execution until the user's intent is confirmed.
  > 2. **AST Security Guard:** We parse the generated SQL into an Abstract Syntax Tree using **JSqlParser**. It physically prevents SQL injections, statement chaining, or any data mutations.
  > 3. **Instant Visual Insights:** Results are automatically mapped into dynamic charts—Bar, Line, and Pie—with sub-20 millisecond execution."
- **Visual Cue:** *Point to the 3 icons (Brain, Shield, Chart).*

---

### Slide 3: The 4-Step Deterministic Pipeline
- **Time:** 40 seconds
- **On Screen:** Interactive pipeline flowchart (1. Intent Parsing → 2. Clarification → 3. AST Security → 4. Execution & Charts) + terminal audit trace.
- **Spoken Script:**
  > "Here is how a query flows through Querify:
  > 
  > - **Step 1:** The user enters natural language, which is normalized and bound to our schema catalog.
  > - **Step 2:** If ambiguity is detected, the engine halts and creates an in-memory session with structured disambiguation choices.
  > - **Step 3:** The confirmed query passes through our AST Security Guard, verifying that it is strictly a read-only SELECT with whitelisted tables and an enforced `LIMIT 100`.
  > - **Step 4:** The query executes through our connection pool in under 20 milliseconds, returning verified records, copyable SQL, and dynamic charts."
- **Visual Cue:** *Trace the 4 step badges horizontally across the screen.*

---

### Slide 4: Enterprise AST Security Barrier
- **Time:** 35 seconds
- **On Screen:** Rejection Rules (Red) vs. Enforced Execution Controls (Green).
- **Spoken Script:**
  > "Database security is non-negotiable. Naive chatbots rely on simple string checks like `.contains('DROP')`, which attackers easily bypass with SQL comments or statement chaining.
  > 
  > Querify uses **JSqlParser** to inspect the real syntax tree:
  > - Any statement chaining (`SELECT 1; DROP TABLE`) is immediately blocked.
  > - Any mutation—`INSERT`, `UPDATE`, `DELETE`, `ALTER`—throws `HTTP 403 Forbidden`.
  > - Only whitelisted domain tables can be queried; internal system tables like `information_schema` are blocked.
  > - Every attempt is permanently recorded in our immutable audit history."
- **Visual Cue:** *Highlight the 'HTTP 403 Forbidden' guarantee.*

---

### Slide 5: Performance & Accuracy Proof
- **Time:** 35 seconds
- **On Screen:** 4 big metric cards (<20ms latency, 100% read-only safety, 0% hallucinations, 6 tables) + Chart.js Bar Chart.
- **Spoken Script:**
  > "Here are the benchmark results.
  > 
  > Notice the chart on the right: on ambiguous business prompts, standard LLMs drop below **35% accuracy** because they guess blindly. Querify achieves **98%+ intent accuracy** because it clarifies first.
  > 
  > Furthermore, our AST validation runs in under **20 milliseconds** with **100% read-only safety** across our 6 relational enterprise tables."
- **Visual Cue:** *Point directly to the red vs. green bar comparison on ambiguous prompts (34% vs 98%).*

---

### Slide 6: Ready for Live Demonstration
- **Time:** 20 seconds
- **On Screen:** 3 tech stack badges (Vercel Edge, Spring Boot 3 + MySQL, React 18 + Vite).
- **Spoken Script:**
  > "Querify is fully implemented and live right now. It is built with a Java 17 Spring Boot backend and a React 18 frontend with obsidian titanium styling.
  > 
  > Let's switch directly to the live workspace to demonstrate the Clarification Engine in real time."
- **Visual Cue:** *Click over to the live browser tab at `querify-nine.vercel.app`.*

---

## 🚀 Live Demo Quick Steps (2 Minutes)

1. **Trigger Clarification:**
   - Click or type: `"Show me the best performing AI companies"`
   - Explain: *"Notice it does not guess. The Clarification Modal appears asking whether we want Revenue, Net Profit, Growth Rate, or ROI."*
2. **Resolve Ambiguity:**
   - Select **"Highest Revenue"** → Click **"Confirm"**.
   - Show the generated SQL with the green `AST Security Verified` badge.
   - Show the resulting data table and toggle to the **Bar Chart**.
3. **Show Out-of-Domain Safety:**
   - Type `"give me top hotels"`.
   - Explain: *"Hotels do not exist in our catalog. Rather than hallucinating mock records, Querify renders an amber warning stating it is outside the schema scope."*
4. **Show Schema Explorer & History:**
   - Click **DB Explorer** to display the 6 relational tables and schema catalog.
   - Click **History** to show the real-time audit log with execution times in milliseconds.
