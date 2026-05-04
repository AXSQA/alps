-- ── Stage definitions ─────────────────────────────────────────────
INSERT INTO stage_definitions (stage_id, item_id, label, required, sort_order) VALUES
  ('business', 'b1', 'Are business objectives clearly defined?',          true,  1),
  ('business', 'b2', 'Have key stakeholders been identified?',            true,  2),
  ('business', 'b3', 'Is there a defined success metric?',                true,  3),
  ('business', 'b4', 'Are constraints or compliance requirements noted?', false, 4),
  ('business', 'b5', 'Has a budget estimate been provided?',              false, 5),
  ('business', 'b6', 'Is there a target delivery date?',                  false, 6),
  ('product',  'p1', 'Are primary user flows documented?',                true,  1),
  ('product',  'p2', 'Have edge cases been identified?',                  true,  2),
  ('product',  'p3', 'Is UX/design review scheduled?',                    true,  3),
  ('product',  'p4', 'Are acceptance criteria defined?',                  false, 4),
  ('product',  'p5', 'Have error states been considered?',                false, 5),
  ('product',  'p6', 'Is there a rollback plan?',                         false, 6),
  ('tech',     't1', 'Have API dependencies been listed?',                true,  1),
  ('tech',     't2', 'Are infrastructure requirements defined?',           true,  2),
  ('tech',     't3', 'Has security review been flagged?',                  true,  3),
  ('tech',     't4', 'Are breaking changes identified?',                   false, 4),
  ('tech',     't5', 'Is performance impact assessed?',                    false, 5),
  ('tech',     't6', 'Has a staging environment been confirmed?',          false, 6)
ON CONFLICT (stage_id, item_id) DO NOTHING;

-- ── Requests ──────────────────────────────────────────────────────
INSERT INTO requests (id, title, owner, business_goal, success_metrics, target_quarter, risk, dashboard_stage, dashboard_progress, op_project_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'SSO Integration',       'Priya S.', 'Enable enterprise customers to authenticate via their own identity providers.', 'Reduce login time by 40%, 95% adoption within 30 days of release.', 'Q2 2026', 'Dependency',         'Tech',     85,  NULL),
  ('00000000-0000-0000-0000-000000000002', 'Bulk Export',           'James K.', 'Allow users to export large datasets in multiple formats for offline analysis.', 'Export 10k rows in under 5 seconds, zero data loss on failure.',        'Q2 2026', 'Missing edge cases', 'Product',  50,  NULL),
  ('00000000-0000-0000-0000-000000000003', 'Role-Based Access',     'Aisha M.', 'Implement granular permission controls across all platform resources.',          'Zero privilege escalation incidents, full audit log coverage.',          'Q2 2026', 'Blocker',            'Business', 20,  NULL),
  ('00000000-0000-0000-0000-000000000004', 'Analytics Dashboard',   'Tom R.',   'Provide real-time usage analytics to help teams track key product metrics.',     '90% of active users access dashboard weekly within 60 days.',           'Q2 2026', '',                   'Ready',    100, NULL)
ON CONFLICT (id) DO NOTHING;

-- ── Stage progress ─────────────────────────────────────────────────
-- SSO Integration: Tech in progress, Business+Product complete
INSERT INTO stage_progress (request_id, stage_id, status, completed, approved) VALUES
  ('00000000-0000-0000-0000-000000000001', 'business',  'complete',    true,  false),
  ('00000000-0000-0000-0000-000000000001', 'product',   'complete',    true,  false),
  ('00000000-0000-0000-0000-000000000001', 'tech',      'in-progress', false, false),
  ('00000000-0000-0000-0000-000000000001', 'execution', 'locked',      false, false),
-- Bulk Export: Product in progress, Business complete
  ('00000000-0000-0000-0000-000000000002', 'business',  'complete',    true,  false),
  ('00000000-0000-0000-0000-000000000002', 'product',   'in-progress', false, false),
  ('00000000-0000-0000-0000-000000000002', 'tech',      'locked',      false, false),
  ('00000000-0000-0000-0000-000000000002', 'execution', 'locked',      false, false),
-- Role-Based Access: Business in progress
  ('00000000-0000-0000-0000-000000000003', 'business',  'in-progress', false, false),
  ('00000000-0000-0000-0000-000000000003', 'product',   'locked',      false, false),
  ('00000000-0000-0000-0000-000000000003', 'tech',      'locked',      false, false),
  ('00000000-0000-0000-0000-000000000003', 'execution', 'locked',      false, false),
-- Analytics Dashboard: all complete including execution
  ('00000000-0000-0000-0000-000000000004', 'business',  'complete',    true,  true),
  ('00000000-0000-0000-0000-000000000004', 'product',   'complete',    true,  true),
  ('00000000-0000-0000-0000-000000000004', 'tech',      'complete',    true,  true),
  ('00000000-0000-0000-0000-000000000004', 'execution', 'complete',    false, true)
ON CONFLICT (request_id, stage_id) DO NOTHING;

-- ── Tickets — SSO Integration ──────────────────────────────────────
INSERT INTO tickets (request_id, op_id, title, assignee, status, sprint, est_completion, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'OP-101', 'Integrate SAML 2.0 identity provider',         'Priya S.', 'Done',        'Sprint 5 — Q2 2026', '20 Jun 2026', 1),
  ('00000000-0000-0000-0000-000000000001', 'OP-102', 'Set up OAuth 2.0 token exchange flow',          'Priya S.', 'Done',        'Sprint 5 — Q2 2026', '20 Jun 2026', 2),
  ('00000000-0000-0000-0000-000000000001', 'OP-103', 'Implement SSO redirect callback handler',       'Dana L.',  'Done',        'Sprint 5 — Q2 2026', '20 Jun 2026', 3),
  ('00000000-0000-0000-0000-000000000001', 'OP-104', 'Add session persistence across SSO login',      'Dana L.',  'Done',        'Sprint 5 — Q2 2026', '20 Jun 2026', 4),
  ('00000000-0000-0000-0000-000000000001', 'OP-105', 'Write unit tests for auth token validation',    'Priya S.', 'In Review',   'Sprint 5 — Q2 2026', '20 Jun 2026', 5),
  ('00000000-0000-0000-0000-000000000001', 'OP-106', 'Security audit of SSO token storage',           'Tom R.',   'In Review',   'Sprint 5 — Q2 2026', '20 Jun 2026', 6),
  ('00000000-0000-0000-0000-000000000001', 'OP-107', 'End-to-end QA across identity providers',       'James K.', 'In Progress', 'Sprint 5 — Q2 2026', '20 Jun 2026', 7),
  ('00000000-0000-0000-0000-000000000001', 'OP-108', 'Update login UI to support SSO entry point',    'Dana L.',  'In Progress', 'Sprint 5 — Q2 2026', '20 Jun 2026', 8),
  ('00000000-0000-0000-0000-000000000001', 'OP-109', 'Document SSO setup guide for enterprise clients','Priya S.','New',        'Sprint 5 — Q2 2026', '20 Jun 2026', 9),
  ('00000000-0000-0000-0000-000000000001', 'OP-110', 'Load test SSO flow under concurrent sessions',  'Tom R.',   'New',         'Sprint 5 — Q2 2026', '20 Jun 2026', 10);

-- ── Tickets — Bulk Export ──────────────────────────────────────────
INSERT INTO tickets (request_id, op_id, title, assignee, status, sprint, est_completion, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'OP-201', 'Design bulk export data pipeline architecture', 'James K.', 'Done',        'Sprint 4 — Q2 2026', '14 Jun 2026', 1),
  ('00000000-0000-0000-0000-000000000002', 'OP-202', 'Implement CSV export for up to 10k rows',        'James K.', 'Done',        'Sprint 4 — Q2 2026', '14 Jun 2026', 2),
  ('00000000-0000-0000-0000-000000000002', 'OP-203', 'Add background job queue for large exports',     'Dana L.',  'Done',        'Sprint 4 — Q2 2026', '14 Jun 2026', 3),
  ('00000000-0000-0000-0000-000000000002', 'OP-204', 'Build Excel (.xlsx) export formatter',           'James K.', 'In Progress', 'Sprint 4 — Q2 2026', '14 Jun 2026', 4),
  ('00000000-0000-0000-0000-000000000002', 'OP-205', 'Add progress indicator UI for export status',    'Dana L.',  'In Progress', 'Sprint 4 — Q2 2026', '14 Jun 2026', 5),
  ('00000000-0000-0000-0000-000000000002', 'OP-206', 'Handle partial export failures gracefully',      'Aisha M.', 'In Review',   'Sprint 4 — Q2 2026', '14 Jun 2026', 6),
  ('00000000-0000-0000-0000-000000000002', 'OP-207', 'Validate edge cases: empty sets, special chars', 'James K.', 'Blocked',     'Sprint 4 — Q2 2026', '14 Jun 2026', 7),
  ('00000000-0000-0000-0000-000000000002', 'OP-208', 'Add export audit log per user action',           'Tom R.',   'New',         'Sprint 4 — Q2 2026', '14 Jun 2026', 8),
  ('00000000-0000-0000-0000-000000000002', 'OP-209', 'Write integration tests for export pipeline',    'Dana L.',  'New',         'Sprint 4 — Q2 2026', '14 Jun 2026', 9),
  ('00000000-0000-0000-0000-000000000002', 'OP-210', 'Performance test export with 100k row dataset',  'James K.', 'New',         'Sprint 4 — Q2 2026', '14 Jun 2026', 10);

-- ── Tickets — Role-Based Access ────────────────────────────────────
INSERT INTO tickets (request_id, op_id, title, assignee, status, sprint, est_completion, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000003', 'OP-301', 'Define role taxonomy and permission matrix',    'Aisha M.', 'Done',        'Sprint 3 — Q2 2026', '30 Jul 2026', 1),
  ('00000000-0000-0000-0000-000000000003', 'OP-302', 'Set up role assignment API endpoints',          'Aisha M.', 'In Progress', 'Sprint 3 — Q2 2026', '30 Jul 2026', 2),
  ('00000000-0000-0000-0000-000000000003', 'OP-303', 'Build admin UI for role management',            'Dana L.',  'Blocked',     'Sprint 3 — Q2 2026', '30 Jul 2026', 3),
  ('00000000-0000-0000-0000-000000000003', 'OP-304', 'Implement permission guard middleware',          'Tom R.',   'On Hold',     'Sprint 3 — Q2 2026', '30 Jul 2026', 4),
  ('00000000-0000-0000-0000-000000000003', 'OP-305', 'Enforce RBAC on existing API routes',           'Aisha M.', 'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 5),
  ('00000000-0000-0000-0000-000000000003', 'OP-306', 'Add role-based UI visibility controls',         'Dana L.',  'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 6),
  ('00000000-0000-0000-0000-000000000003', 'OP-307', 'Write tests for permission boundary cases',     'James K.', 'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 7),
  ('00000000-0000-0000-0000-000000000003', 'OP-308', 'Audit existing user data for role migration',   'Aisha M.', 'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 8),
  ('00000000-0000-0000-0000-000000000003', 'OP-309', 'Document RBAC model for engineering team',      'Tom R.',   'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 9),
  ('00000000-0000-0000-0000-000000000003', 'OP-310', 'Security review of privilege escalation paths', 'Tom R.',   'New',         'Sprint 3 — Q2 2026', '30 Jul 2026', 10);

-- ── Tickets — Analytics Dashboard ─────────────────────────────────
INSERT INTO tickets (request_id, op_id, title, assignee, status, sprint, est_completion, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000004', 'OP-401', 'Design analytics data model and schema',          'Tom R.',   'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 1),
  ('00000000-0000-0000-0000-000000000004', 'OP-402', 'Build event tracking ingestion pipeline',          'Tom R.',   'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 2),
  ('00000000-0000-0000-0000-000000000004', 'OP-403', 'Implement dashboard chart components',             'Dana L.',  'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 3),
  ('00000000-0000-0000-0000-000000000004', 'OP-404', 'Add date range filter to all charts',              'Dana L.',  'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 4),
  ('00000000-0000-0000-0000-000000000004', 'OP-405', 'Connect live data to dashboard via API',           'Tom R.',   'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 5),
  ('00000000-0000-0000-0000-000000000004', 'OP-406', 'Add user segment breakdown views',                 'James K.', 'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 6),
  ('00000000-0000-0000-0000-000000000004', 'OP-407', 'Write E2E tests for dashboard rendering',          'Priya S.', 'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 7),
  ('00000000-0000-0000-0000-000000000004', 'OP-408', 'Performance optimise queries for large datasets',  'Tom R.',   'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 8),
  ('00000000-0000-0000-0000-000000000004', 'OP-409', 'Accessibility audit on all dashboard views',       'Dana L.',  'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 9),
  ('00000000-0000-0000-0000-000000000004', 'OP-410', 'Deploy analytics dashboard to production',         'Tom R.',   'Done', 'Sprint 6 — Q2 2026', '2 May 2026', 10);
