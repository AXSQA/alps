-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── requests ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  owner             TEXT NOT NULL,
  business_goal     TEXT NOT NULL DEFAULT '',
  success_metrics   TEXT NOT NULL DEFAULT '',
  target_quarter    TEXT NOT NULL DEFAULT '',
  risk              TEXT NOT NULL DEFAULT '',
  dashboard_stage   TEXT NOT NULL DEFAULT 'Business',
  dashboard_progress INT NOT NULL DEFAULT 0,
  op_project_id     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── stage_definitions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stage_definitions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id   TEXT NOT NULL,   -- 'business' | 'product' | 'tech'
  item_id    TEXT NOT NULL,   -- 'b1', 'p3', etc.
  label      TEXT NOT NULL,
  required   BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (stage_id, item_id)
);

-- ── checklist_state ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS checklist_state (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  stage_id   TEXT NOT NULL,
  item_id    TEXT NOT NULL,
  checked    BOOLEAN NOT NULL DEFAULT false,
  note       TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id, stage_id, item_id)
);

-- ── stage_progress ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stage_progress (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  stage_id   TEXT NOT NULL,   -- 'business' | 'product' | 'tech' | 'execution'
  status     TEXT NOT NULL DEFAULT 'locked',  -- 'locked'|'not-started'|'in-progress'|'complete'
  completed  BOOLEAN NOT NULL DEFAULT false,
  approved   BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id, stage_id)
);

-- ── tickets ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  op_id          TEXT NOT NULL,
  title          TEXT NOT NULL,
  assignee       TEXT NOT NULL DEFAULT '—',
  status         TEXT NOT NULL DEFAULT 'New',
  sprint         TEXT NOT NULL DEFAULT '',
  est_completion TEXT NOT NULL DEFAULT '',
  sort_order     INT NOT NULL DEFAULT 0
);
