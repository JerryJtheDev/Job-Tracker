# Pipeline // Developer Job Tracker

A personal, focused command-center application for software engineers actively managing a multi-track job search. Designed as an intentional, tactile developer tool—not a generic marketing landing page or cookie-cutter SaaS board.

---

## 🎯 Architectural & Visual Philosophy

### 1. Asymmetric Focus Layout
Rather than four identical, squeezed Kanban columns, Pipeline uses an **asymmetric layout**:
- **Wide Primary Focus Stage (~65% width)**: Centers attention on the active, high-leverage stage (defaults to **Interviewing**, where screens, system design loops, and take-homes live).
- **Collapsible Secondary Queues (~35% width)**: Stacks the remaining stages as compact, interactive drawers showing candidate counts, quick grab handles, and drop targets.
- **One-Touch Focus Promotion**: Instantly swap any stage to become the primary panel via the header pills or hotkeys (`1`–`4`).

### 2. Tactile Ticket-Stub Visual Language
Eliminates rounded-rectangle cards with colored left stripes, initial avatars, and background pill badges:
- **Asymmetric Corner Dog-Ear**: Diagonal folded corner stamp displaying stage codes (`INT`, `APP`, `OFF`, `REJ`).
- **Typography-First Monogram**: Bold uppercase company tracking paired with monospace reference serials (`№ LIN-001 / LINEAR`).
- **Perforated Stub & Notch Cutouts**: A dashed tear-off line with authentic semicircular bite notches matching the canvas depth.
- **Zero-Pill Metadata System**: Inline monospace details separated by clean vertical rules (`|`), utilizing typographic weight rather than colored pill backgrounds.
- **Typewriter Memo Block**: High-priority prep talking points and requirements formatted as an index card dispatch memo (`MEMO:`).

### 3. Atmospheric Canvas & Disciplined Palette
- **Layered Background Depth**: Multi-point ambient radial gradients blended over a deep `#080b11` canvas with a fine 1.5% blueprint grid texture.
- **Reserved Amber**: The confident amber accent is strictly reserved for the single primary creation action (`+ Log Role` / form submission).
- **Unified Supporting Palette**: Active in-flight stages (`Interviewing` & `Offer`) share cohesive **Electric Teal & Mint** tones, while queue stages (`Applied` & `Rejected`) use disciplined technical slate and charcoal.
- **Dynamic Contrast Hierarchy**: Crisp white headers and figures (`tabular-nums font-bold`) contrast against calm, muted secondary metadata.

---

## ⚡ Core Features

- **Fluid Drag & Drop (`@dnd-kit`)**: Smooth transfer of tickets between the primary focus stage and secondary collapsible queues (or between queues).
- **Integrated Command Deck**: Live telemetry HUD displaying:
  - Total applications tracked.
  - Rolling 7-day momentum vs. previous week (`+X vs last wk`).
  - Response rate percentage (applications moved past initial submission).
  - Switchable Chart.js visualizer (Pipeline Doughnut Breakdown & 4-Week Velocity Bar Chart).
  - High-priority "Today's Focus" action items.
- **Icon-Only Activity Strip & Command Bar**: Slim vertical strip on the far-left edge paired with a single-line terminal command header (`pipeline / interviewing`) and inline search.
- **Deep Application Detail & Activity Log**: Timestamped interview log entries, recruiter contacts, target compensation, and inline-editable prep notes.
- **Offline Persistence & Portability**: Automatically persists to `localStorage` with pre-seeded sample developer roles (Linear, Stripe, GitHub, Cloudflare, Supabase, Datadog), plus one-click JSON backup export and import.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `N` | Log new job application |
| `/` | Focus search filter bar |
| `1` | Switch primary focus to **Applied** |
| `2` | Switch primary focus to **Interviewing** |
| `3` | Switch primary focus to **Offer** |
| `4` | Switch primary focus to **Rejected** |
| `Esc` | Close modals / clear search / blur input |

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Visualizations**: `chart.js` + `react-chartjs-2`
- **Icons**: `lucide-react`
- **Typography**: *Plus Jakarta Sans* (geometric sans) & *JetBrains Mono* (monospace)

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```
