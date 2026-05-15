# Project Context — ReadyOps (`alps`)

> This file is intended for AI coding agents. It provides authoritative context about the project, its structure, and the primary prototype artifact.

---

## 1. What This Project Is

**ReadyOps** is a **feature readiness review platform**. Its purpose is to gate a software feature through a structured series of readiness checks — covering business, product, tech, and marketing disciplines — before the feature enters active development or ships to production.

Each feature is tracked as a **Readiness Request**. A request moves through named **Gates** (e.g. Business, Product, Tech, Marketing), each subdivided into **Groups** (e.g. Strategy & Objectives, Compliance & Legal). Each group contains individual **checklist items** that must be completed before the group — and ultimately the gate — can be signed off.

The final gate, **Execution**, is not checklist-driven. It displays linked work tickets and their status, acting as a live tracker once development is underway.

---

## 2. Repository Structure

```
alps/
├── index_static.html      # PRIMARY PROTOTYPE — self-contained, no backend required
├── checklist_config.js    # Single source of truth for all gates, groups, and checklist items
├── feature_types.js       # Change classification taxonomy (feature types, exemption logic)
└── CONTEXT.md             # This file — AI agent context
```

---

## 3. The Prototype: `index_static.html`

### Role

`index_static.html` is the **primary prototype artifact** for this project. It is a fully self-contained single-page application that runs entirely in the browser with zero backend dependency. No server, no database, no API calls are required — it can be opened directly from the filesystem.

Its title tag is: `"Implementation Readiness Platform (Static)"`

All state lives in JavaScript variables in memory and resets on page refresh. It is designed for demos and design iteration, not persistence.

### Views

The file implements four views, toggled by adding/removing an `active` CSS class on `<div class="view">` containers:

| View ID | Description |
|---|---|
| `view-dashboard` | Summary table of all requests with status chips (Total / Ready / In Progress / Blocked) |
| `view-create` | Form to create a new readiness request |
| `view-workflow` | Main checklist workspace: gate sidebar, group tabs, checklist items, AI Auditor panel |
| `view-summary` | Read-only progress overview with per-gate and per-group completion %, required missing counts, and approve buttons |

### Navigation

- `showView(id)` — switches the active view
- `switchGate(gateId)` — changes the active gate in the workflow view
- `switchGroup(gateId, groupId)` — switches the active group tab within a gate
- `loadAndSwitchToGroup(gateId, groupId)` — navigates from summary directly to a specific group in the workflow view

---

## 4. Mock Data in `index_static.html`

All data is hardcoded in `<script>` blocks inside `index_static.html`.

### `MOCK_REQUESTS` — The 4 Sample Features

```js
const MOCK_REQUESTS = [
  { id:'r1', title:'SSO Integration',     owner:'Priya S.',  risk:'Dependency',         dashboard_stage:'Tech',     dashboard_progress:52,  signoffMode:'manual' },
  { id:'r2', title:'Bulk Export',         owner:'James K.',  risk:'Missing edge cases', dashboard_stage:'Product',  dashboard_progress:30,  signoffMode:'auto'   },
  { id:'r3', title:'Role-Based Access',   owner:'Aisha M.',  risk:'Blocker',            dashboard_stage:'Business', dashboard_progress:10,  signoffMode:'auto'   },
  { id:'r4', title:'Analytics Dashboard', owner:'Tom R.',    risk:'',                   dashboard_stage:'Ready',    dashboard_progress:100, signoffMode:'manual' },
];
```

- `dashboard_stage` — the gate currently active for this request (shown in the dashboard table as "Active Gate")
- `dashboard_progress` — overall % completion shown in the dashboard progress bar
- `signoffMode` — `'auto'` (group completes automatically when all required items are checked) or `'manual'` (a "Sign off group" button must be clicked explicitly)

### `MOCK_TICKETS` — Execution Tickets per Request

Each request has a sprint label, estimated completion date, and a list of tickets:

| Request | Sprint | Est. Completion | Ticket Count |
|---|---|---|---|
| r1 — SSO Integration | Sprint 14 | 12 Jun 2026 | 10 (SSO-001 to SSO-010) |
| r2 — Bulk Export | Sprint 15 | 30 Jun 2026 | 6 (EXP-001 to EXP-006) |
| r3 — Role-Based Access | Sprint 16 | 15 Jul 2026 | 4 (RBA-001 to RBA-004) |
| r4 — Analytics Dashboard | Sprint 13 | 01 May 2026 | 7 (ANL-001 to ANL-007, all Done) |

Ticket fields: `op_id`, `title`, `assignee`, `status`

Ticket statuses used: `Done`, `In Progress`, `In Review`, `New`, `Blocked`, `On Hold`

### `INITIAL_CHECKS` — Pre-seeded Checkbox State

Each request starts with a specific set of checkboxes already ticked, representing realistic in-progress state:

- **r1 (SSO Integration):** Partially complete across Business and Product; barely started in Tech; nothing in Marketing
- **r2 (Bulk Export):** Light progress in Business and Product; Tech and Marketing untouched
- **r3 (Role-Based Access):** Only one item checked (`b-s1`); effectively not started
- **r4 (Analytics Dashboard):** Every single item checked across all gates — represents a fully completed request

`INITIAL_CHECKS` keys follow the structure: `INITIAL_CHECKS[requestId][gateId][groupId][itemId] = boolean`

---

## 5. Checklist Architecture (`checklist_config.js`)

This file is the **single source of truth** for all gates, groups, and items. Referenced by `index_static.html` via `<script src="checklist_config.js">`.

### Structure: Gates → Groups → Items

```
STAGE_GROUPS
├── business  🏢  (4 groups, 17 items)
│   ├── strategy      — Strategy & Objectives       (4 items: b-s1 to b-s4)
│   ├── compliance    — Compliance & Legal           (5 items: b-c1 to b-c5)
│   ├── finance       — Finance & Budget             (4 items: b-f1 to b-f4)
│   └── stakeholders  — Stakeholders                 (4 items: b-st1 to b-st4)
├── product   📦  (3 groups, 13 items)
│   ├── userstories   — User Stories                 (4 items: p-u1 to p-u4)
│   ├── design        — Design & UX                  (5 items: p-d1 to p-d5)
│   └── edgecases     — Edge Cases & Risks           (4 items: p-e1 to p-e4)
├── tech      ⚙️  (6 groups, 29 items)
│   ├── architecture  — Architecture                 (4 items: t-a1 to t-a4)
│   ├── security      — Security                     (5 items: t-sec1 to t-sec5)
│   ├── frontend      — Frontend                     (5 items: t-fe1 to t-fe5)
│   ├── backend       — Backend                      (5 items: t-be1 to t-be5)
│   ├── qa            — QA                           (5 items: t-qa1 to t-qa5)
│   └── techops       — TechOps & Operations         (5 items: t-o1 to t-o5)
├── marketing 📣  (1 group, 6 items)
│   └── marketing     — Marketing                    (6 items: m1 to m6)
└── execution 🚀  (no groups — ticket-driven only)
```

**Total: 5 gates, 14 groups, 65 checklist items**

### Item Schema

```js
{ id: 'b-s1', label: 'Business objectives documented', required: true }
```

- `required: true` — item must be checked for the group to be auto-completable
- `required: false` — optional; does not block group completion

### Sign-off Modes

Configured per-request at creation time. Stored in `signoffMode` on each request object.

- `'auto'` — group status transitions to `'complete'` automatically when all required items are checked
- `'manual'` — a "Sign off group" button appears; the user must explicitly click it

Default: `DEFAULT_SIGNOFF_MODE = 'auto'`

### AI Content

`checklist_config.js` also exports:

- **`ITEM_TIPS`** — 65 contextual tip strings keyed by item id. Displayed in the confirmation modal and AI Auditor panel when an item is focused.
- **`ITEM_FOLLOWUPS`** — 65 follow-up strings keyed by item id. Displayed in the AI Auditor panel after a required item is checked (with a 500ms delay).

The AI Auditor is **fully mocked** — there are no real API calls. The panel shows "Online" status and a `✦` avatar for cosmetic effect only. All responses come from `ITEM_TIPS`, `ITEM_FOLLOWUPS`, and a set of hardcoded `AI_OPENERS` strings.

---

## 6. Runtime State in `index_static.html`

All mutable state lives in a single `state` object:

```js
let state = {
  activeRequest:  null,       // id of the currently open request ('r1'–'r4')
  activeGate:     'business', // currently selected gate key
  activeGroup:    null,       // currently selected group key within the gate
  aiPanelOpen:    true,       // AI Auditor sidebar open/collapsed
  signoffMode:    'auto',     // inherited from the active request
  checks:         {},         // checks[gateId][groupId][itemId] = boolean
  notes:          {},         // notes[gateId][groupId][itemId] = string
  groupStatus:    {},         // groupStatus[gateId][groupId] = 'not-started'|'in-progress'|'complete'
  groupSignedOff: {},         // groupSignedOff[gateId][groupId] = boolean
  approvals:      {},         // approvals[gateId] = boolean
  ticketCache:    null,       // cached ticket data for the Execution gate
};
```

State is initialised from `INITIAL_CHECKS` when a request is opened, via `blankState()` merged with the hardcoded data.

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Frontend CSS | Tailwind CSS (CDN — `cdn.tailwindcss.com`) |
| Frontend JS | Vanilla JavaScript, no framework |
| Fonts | Google Fonts — Inter (400/500/600/700) |

---

## 8. Known Prototype Characteristics

These are intentional shortcuts, not bugs:

1. **All state resets on page refresh** — `index_static.html` has no persistence mechanism.
2. **AI Auditor is fully mocked** — no real AI API is called anywhere in the codebase.
3. **Owner list is hardcoded** — the Create form has a fixed `<select>` with 5 options: Priya S., James K., Aisha M., Tom R., Dana L.
4. **Target quarters are hardcoded** — Q1–Q4 2026 only.
5. **No authentication** — single workspace, no login, sessions, or access control.
6. **Key risks in the summary view are static strings** — five hardcoded sentences appear for every request regardless of actual state.
