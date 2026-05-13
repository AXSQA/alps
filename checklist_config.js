/**
 * checklist_config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single source of truth for all readiness gates, sub-groups,
 * and checklist items.
 *
 * HOW TO EDIT:
 *   • Add a new gate: add a new key under STAGE_GROUPS.
 *   • Add a new sub-group: add a key under the gate's `groups` object.
 *   • Add a checklist item: push an object into a group's `items` array.
 *     Each item must have:
 *       id       {string}  — unique across ALL items
 *       label    {string}  — display text
 *       required {boolean} — if true, required for group/gate completion
 *
 * SIGN-OFF MODE:
 *   Set per-request at creation time (stored in request state).
 *   'auto'   — group is marked complete automatically when all required items
 *              are checked.
 *   'manual' — a "Sign off group" button appears; user must explicitly sign off.
 *   The defaultSignoffMode below is used as the pre-selected default in the
 *   create-request form; individual requests can override it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const DEFAULT_SIGNOFF_MODE = 'auto'; // 'auto' | 'manual'

const STAGE_GROUPS = {

  // ── BUSINESS ──────────────────────────────────────────────────────────────
  business: {
    label: 'Business',
    icon: '🏢',
    groups: {

      strategy: {
        label: 'Strategy & Objectives',
        items: [
          { id: 'b-s1', label: 'Business objectives documented',             required: true  },
          { id: 'b-s2', label: 'Success metrics defined and measurable',      required: true  },
          { id: 'b-s3', label: 'Executive sponsor confirmed',                 required: false },
          { id: 'b-s4', label: 'Strategic alignment with OKRs confirmed',     required: false },
        ]
      },

      compliance: {
        label: 'Compliance & Legal',
        items: [
          { id: 'b-c1', label: 'Compliance requirements reviewed',            required: true  },
          { id: 'b-c2', label: 'Legal sign-off obtained',                     required: true  },
          { id: 'b-c3', label: 'Data privacy impact assessed (PDPA/GDPR)',    required: true  },
          { id: 'b-c4', label: 'Regulatory constraints documented',           required: false },
          { id: 'b-c5', label: 'Contractual obligations identified',          required: false },
        ]
      },

      finance: {
        label: 'Finance & Budget',
        items: [
          { id: 'b-f1', label: 'Budget approved and allocated',               required: true  },
          { id: 'b-f2', label: 'Cost estimates reviewed by Finance',          required: true  },
          { id: 'b-f3', label: 'Chargeback / cost centre assigned',           required: false },
          { id: 'b-f4', label: 'ROI or benefit case documented',              required: false },
        ]
      },

      stakeholders: {
        label: 'Stakeholders',
        items: [
          { id: 'b-st1', label: 'Stakeholders identified and notified',       required: true  },
          { id: 'b-st2', label: 'RACI matrix defined',                        required: true  },
          { id: 'b-st3', label: 'Escalation path documented',                 required: false },
          { id: 'b-st4', label: 'Change management plan in place',            required: false },
        ]
      },

    }
  },

  // ── PRODUCT ───────────────────────────────────────────────────────────────
  product: {
    label: 'Product',
    icon: '📦',
    groups: {

      userstories: {
        label: 'User Stories',
        items: [
          { id: 'p-u1', label: 'User stories written and reviewed',           required: true  },
          { id: 'p-u2', label: 'Acceptance criteria defined',                 required: true  },
          { id: 'p-u3', label: 'Rollback / feature flag strategy defined',    required: false },
          { id: 'p-u4', label: 'Story point estimates completed',             required: false },
        ]
      },

      design: {
        label: 'Design & UX',
        items: [
          { id: 'p-d1', label: 'UI/UX designs approved',                      required: true  },
          { id: 'p-d2', label: 'Accessibility reviewed (WCAG 2.1 AA)',         required: true  },
          { id: 'p-d3', label: 'Design system compliance checked',             required: false },
          { id: 'p-d4', label: 'Mobile / responsive layouts approved',         required: false },
          { id: 'p-d5', label: 'Dark mode and theme variants considered',      required: false },
        ]
      },

      edgecases: {
        label: 'Edge Cases & Risks',
        items: [
          { id: 'p-e1', label: 'Edge cases documented',                        required: true  },
          { id: 'p-e2', label: 'Error states and empty states specified',       required: true  },
          { id: 'p-e3', label: 'Concurrent user scenarios considered',          required: false },
          { id: 'p-e4', label: 'Network failure / offline behaviour defined',   required: false },
        ]
      },

    }
  },

  // ── TECH ──────────────────────────────────────────────────────────────────
  tech: {
    label: 'Tech',
    icon: '⚙️',
    groups: {

      architecture: {
        label: 'Architecture',
        items: [
          { id: 't-a1', label: 'Architecture reviewed and approved',           required: true  },
          { id: 't-a2', label: 'Architecture Decision Record (ADR) published', required: true  },
          { id: 't-a3', label: 'Scalability under peak load assessed',         required: false },
          { id: 't-a4', label: 'Service dependencies mapped',                  required: false },
        ]
      },

      security: {
        label: 'Security',
        items: [
          { id: 't-sec1', label: 'Security review completed (infosec sign-off)', required: true  },
          { id: 't-sec2', label: 'Threat modelling conducted',                   required: true  },
          { id: 't-sec3', label: 'Authentication & authorisation design reviewed',required: true  },
          { id: 't-sec4', label: 'Penetration test scheduled or completed',       required: false },
          { id: 't-sec5', label: 'Secrets management approach documented',        required: false },
        ]
      },

      frontend: {
        label: 'Frontend',
        items: [
          { id: 't-fe1', label: 'Frontend component library compliance checked',  required: true  },
          { id: 't-fe2', label: 'Cross-browser and device testing completed',      required: true  },
          { id: 't-fe3', label: 'Performance budget defined (Core Web Vitals)',    required: false },
          { id: 't-fe4', label: 'Asset optimisation and lazy loading reviewed',    required: false },
          { id: 't-fe5', label: 'Analytics and event tracking implemented',        required: false },
        ]
      },

      backend: {
        label: 'Backend',
        items: [
          { id: 't-be1', label: 'API contracts defined and versioned',            required: true  },
          { id: 't-be2', label: 'Third-party rate limits documented',             required: true  },
          { id: 't-be3', label: 'Error handling and retry strategy defined',      required: true  },
          { id: 't-be4', label: 'API authentication method reviewed',             required: false },
          { id: 't-be5', label: 'Background job / queue design reviewed',         required: false },
        ]
      },

      qa: {
        label: 'QA',
        items: [
          { id: 't-qa1', label: 'QA sign-off on test plan',                       required: true  },
          { id: 't-qa2', label: 'E2E test coverage reviewed',                     required: true  },
          { id: 't-qa3', label: 'Regression test suite updated',                  required: true  },
          { id: 't-qa4', label: 'Performance / load testing completed',           required: false },
          { id: 't-qa5', label: 'UAT sign-off obtained',                          required: false },
        ]
      },

      techops: {
        label: 'TechOps & Operations',
        items: [
          { id: 't-o1', label: 'On-call runbook updated',                         required: true  },
          { id: 't-o2', label: 'Performance impact on existing services assessed', required: true  },
          { id: 't-o3', label: 'Monitoring and alerting configured',               required: false },
          { id: 't-o4', label: 'Deployment runbook documented',                    required: false },
          { id: 't-o5', label: 'Rollback procedure tested in staging',             required: false },
        ]
      },

    }
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────
  marketing: {
    label: 'Marketing',
    icon: '📣',
    groups: {

      marketing: {
        label: 'Marketing',
        items: [
          { id: 'm1', label: 'Go-to-market plan documented',                    required: true  },
          { id: 'm2', label: 'Launch comms drafted and reviewed',               required: true  },
          { id: 'm3', label: 'Brand & messaging aligned with stakeholders',     required: true  },
          { id: 'm4', label: 'Launch date confirmed with PM',                   required: false },
          { id: 'm5', label: 'Customer-facing content approved',                required: false },
          { id: 'm6', label: 'Internal enablement materials ready',             required: false },
        ]
      },

    }
  },

  // ── EXECUTION ─────────────────────────────────────────────────────────────
  // Note: Execution has no sub-groups — it is driven by the ticket tracker.
  execution: {
    label: 'Execution',
    icon: '🚀',
    groups: {}
  },

};

/**
 * AI tips shown in the confirmation modal and AI panel when a checklist item
 * is focused. Keyed by item id.
 */
const ITEM_TIPS = {
  // Business – Strategy
  'b-s1': 'Make sure objectives are measurable and time-bound — vague goals like "improve performance" are hard to sign off downstream.',
  'b-s2': 'Success metrics should be quantifiable (e.g. "reduce login time by 40%"). Avoid subjective measures that QA cannot verify.',
  'b-s3': 'An executive sponsor is your escalation path if the project stalls. Without one, blockers tend to go unresolved.',
  'b-s4': 'Ensure this feature is explicitly tied to a current OKR — features without strategic alignment are the first to be descoped.',
  // Business – Compliance
  'b-c1': 'Compliance requirements discovered late are expensive. Loop in legal now even if you think this feature is low-risk.',
  'b-c2': 'Legal sign-off should be in writing. A Slack message or verbal confirmation is not sufficient for audit purposes.',
  'b-c3': 'If the feature touches personal data, a DPIA is likely required. Check with your DPO before proceeding.',
  'b-c4': 'Regulatory constraints that surface in staging are costly. Identify them here to avoid late-stage rework.',
  'b-c5': 'If this is tied to a contractual commitment, flag it explicitly — it changes the risk profile significantly.',
  // Business – Finance
  'b-f1': 'Budget approval should be in writing. A verbal go-ahead is not sufficient for audit purposes.',
  'b-f2': 'Finance should review both CAPEX and OPEX implications, especially if third-party services are involved.',
  'b-f3': 'Without a cost centre assignment, finance reporting will be inaccurate and chargebacks will be delayed.',
  'b-f4': 'A documented ROI case makes it easier to justify scope if budget is later challenged.',
  // Business – Stakeholders
  'b-st1': 'Stakeholder lists often miss legal and compliance teams. Double-check all approval chains are included.',
  'b-st2': 'A RACI matrix prevents accountability gaps. Every workstream should have a single Responsible and a single Accountable.',
  'b-st3': 'Without a documented escalation path, blockers often stall indefinitely.',
  'b-st4': 'Change management is most effective when started early — do not leave it until launch week.',
  // Product – User Stories
  'p-u1': 'User stories should follow "As a [user], I want [goal], so that [reason]" and be independently testable.',
  'p-u2': 'Acceptance criteria must be unambiguous — avoid phrases like "works correctly". QA will need to verify these independently.',
  'p-u3': 'A feature flag is the recommended rollback strategy — it lets you disable in production without a code deploy.',
  'p-u4': 'Story points without team agreement are noise. Ensure the estimate reflects complexity, not just time.',
  // Product – Design
  'p-d1': 'Design approval should include sign-off on both happy path and error states. Partial approvals cause rework.',
  'p-d2': 'WCAG 2.1 AA is the standard baseline. Accessibility issues found post-launch are significantly more expensive to fix.',
  'p-d3': 'Components that deviate from the design system create long-term maintenance debt.',
  'p-d4': 'Mobile layouts are commonly approved last — schedule this review early to avoid blocking QA.',
  'p-d5': 'If your product supports dark mode, confirm theme tokens are applied correctly in all new components.',
  // Product – Edge Cases
  'p-e1': 'Edge cases that are undocumented now will become bugs in production. Common ones: empty states, concurrent users, slow networks.',
  'p-e2': 'Error states are often spec\'d last but noticed first by users. Document them explicitly.',
  'p-e3': 'Concurrent user scenarios are a common source of race conditions — consider optimistic locking or conflict resolution strategies.',
  'p-e4': 'If the user loses connection mid-flow, the system should preserve progress and provide a clear recovery path.',
  // Tech – Architecture
  't-a1': 'Architecture review should explicitly cover scalability under peak load, not just current expected traffic.',
  't-a2': 'An ADR ensures future engineers understand why the decision was made, not just what was decided.',
  't-a3': 'Request a load test in staging at expected 3x peak traffic before sign-off.',
  't-a4': 'Undocumented service dependencies are a common source of production incidents during deploys.',
  // Tech – Security
  't-sec1': 'Security review must be in writing from the infosec team. A Slack message or verbal confirmation is not sufficient.',
  't-sec2': 'Threat modelling surfaces issues that code review typically misses — especially privilege escalation and data exposure paths.',
  't-sec3': 'AuthN/AuthZ design reviewed late is expensive to change. Lock this in before implementation starts.',
  't-sec4': 'Penetration tests should be scheduled at least 2 sprints before go-live to allow remediation time.',
  't-sec5': 'Hardcoded secrets are a critical vulnerability. Confirm all secrets are in a vault, not in code or config files.',
  // Tech – Frontend
  't-fe1': 'Components that deviate from the design system create long-term maintenance debt and visual inconsistency.',
  't-fe2': 'Cross-browser testing should cover the top browsers by your user base — check analytics for actual distribution.',
  't-fe3': 'Core Web Vitals (LCP, CLS, FID) directly impact SEO and user retention. Set budgets before development starts.',
  't-fe4': 'Unoptimised assets are one of the easiest performance wins — confirm images are compressed and JS is code-split.',
  't-fe5': 'Analytics events must be defined before release — retrofitting tracking post-launch misses early adopter data.',
  // Tech – Backend
  't-be1': 'API contracts should be version-pinned. Breaking changes without versioning are a common source of production incidents.',
  't-be2': 'Third-party rate limits are a common source of production surprises. Document limits, retry strategies, and fallback behaviour.',
  't-be3': 'Without a defined retry strategy, transient errors will surface as user-facing failures.',
  't-be4': 'API authentication method should be reviewed before implementation — changing it post-build is costly.',
  't-be5': 'Background jobs that fail silently are a common source of data inconsistency. Ensure dead-letter queues are configured.',
  // Tech – QA
  't-qa1': 'QA sign-off on the test plan ensures coverage gaps are identified before development completes, not after.',
  't-qa2': 'E2E tests should cover the critical user journeys, not just happy paths.',
  't-qa3': 'An updated regression suite prevents silent breakage of existing functionality.',
  't-qa4': 'Performance testing in staging on a production-sized dataset is the only reliable predictor of production behaviour.',
  't-qa5': 'UAT sign-off from a real end user or business representative catches usability issues that internal QA misses.',
  // Tech – TechOps
  't-o1': 'The on-call runbook should cover the top 5 failure modes for this feature, not just generic instructions.',
  't-o2': 'Performance impact on shared services is commonly underestimated. Request a load test before staging sign-off.',
  't-o3': 'Alerts should be actionable — avoid alert fatigue by setting thresholds based on user impact, not raw metrics.',
  't-o4': 'A deployment runbook prevents critical steps being missed during a time-pressured release.',
  't-o5': 'A rollback that has never been tested will fail when you need it most.',
  // Marketing
  'm1': 'A GTM plan without a defined launch date is a draft, not a plan. Confirm dates before marking this complete.',
  'm2': 'Launch comms should be reviewed by both marketing and the product owner — messaging gaps surface here.',
  'm3': 'Misaligned messaging between marketing and product is one of the most common causes of confused users at launch.',
  'm4': 'The launch date must be locked in with PM before external comms are sent — changes after announcement are costly.',
  'm5': 'Customer-facing content should go through a legal read if it includes claims, comparisons, or pricing.',
  'm6': 'Internal enablement materials ensure support and sales teams are ready on day one — not day ten.',
};

/**
 * AI follow-up messages shown in the AI panel after a required item is checked.
 * Keyed by item id.
 */
const ITEM_FOLLOWUPS = {
  // Business – Strategy
  'b-s1': 'Good. Make sure the objectives are also visible to downstream stages — include a link in the notes.',
  'b-s2': 'Confirmed. Share these metrics with all stage owners so everyone is aligned on the definition of success.',
  'b-s3': 'With an executive sponsor confirmed, make sure they are aware of the escalation path — do not assume they will self-activate.',
  'b-s4': 'OKR alignment confirmed. Flag this feature in your OKR tracking tool so progress is visible to leadership.',
  // Business – Compliance
  'b-c1': 'Good call locking this in early. If there are any data residency requirements, flag them to the Tech team now.',
  'b-c2': 'Legal signed off. Store the written confirmation in the project documentation for audit traceability.',
  'b-c3': 'DPIA completed. Ensure the output is stored with the project records and flagged to the Security group in Tech.',
  'b-c4': 'Regulatory constraints documented. Share these with the Tech Architecture and Security groups immediately.',
  'b-c5': 'Contractual obligations identified. Ensure the delivery timeline reflects any SLA or contractual deadlines.',
  // Business – Finance
  'b-f1': 'Confirmed. Ensure the approved budget figure is documented — scope creep arguments are easier to deflect with a written baseline.',
  'b-f2': 'Finance reviewed. If there are ongoing OPEX costs (e.g. SaaS licenses), flag these for the annual budget cycle.',
  'b-f3': 'Cost centre assigned. Confirm the code is correct with Finance before any spend is committed.',
  'b-f4': 'ROI case documented. Tie this back to the success metrics in Strategy & Objectives.',
  // Business – Stakeholders
  'b-st1': 'Worth confirming: has the legal team been explicitly included? They are the most commonly missed stakeholder.',
  'b-st2': 'RACI defined. Share it with all named parties and get acknowledgement — a RACI no one has seen is not a RACI.',
  'b-st3': 'Escalation path documented. Make sure the sponsor is aware they are the final escalation point.',
  'b-st4': 'Change management plan in place. Start internal communications early — launch-week surprises erode trust.',
  // Product – User Stories
  'p-u1': 'With stories written, next priority is ensuring each one maps to at least one acceptance criterion.',
  'p-u2': 'Solid. Share acceptance criteria with QA early so they can start test planning in parallel with development.',
  'p-u3': 'Feature flag strategy confirmed. Make sure the flag is added to the feature registry and the kill-switch owner is documented.',
  'p-u4': 'Estimates locked. Flag any stories with high uncertainty to the tech lead before sprint planning.',
  // Product – Design
  'p-d1': 'Design approved. Confirm that approved designs include both light/dark mode and mobile breakpoints if applicable.',
  'p-d2': 'Accessibility reviewed. Consider scheduling a screen-reader walkthrough with QA before the release.',
  'p-d3': 'Design system compliance confirmed. Flag any approved deviations to the design system team for future consideration.',
  'p-d4': 'Mobile layouts approved. Ensure QA includes device testing on both iOS and Android in their test plan.',
  'p-d5': 'Theme variants confirmed. Run a visual regression test after implementation to catch any missed tokens.',
  // Product – Edge Cases
  'p-e1': 'Good. The most commonly missed edge cases are network failure mid-action and concurrent session conflicts.',
  'p-e2': 'Error states documented. Ensure these are included in the QA test plan as explicit test cases.',
  'p-e3': 'Concurrent scenarios covered. Flag any identified race conditions to the Backend group for mitigation.',
  'p-e4': 'Offline behaviour defined. Confirm the UX for reconnection and data sync is also specified.',
  // Tech – Architecture
  't-a1': 'Architecture locked. Make sure all engineers have reviewed the ADR before development starts.',
  't-a2': 'ADR published. Link it from the project documentation so it is discoverable long after the feature ships.',
  't-a3': 'Scalability assessed. Set a performance budget and add automated regression tests to catch degradation in CI.',
  't-a4': 'Dependencies mapped. Share the dependency diagram with TechOps so the runbook reflects the full blast radius.',
  // Tech – Security
  't-sec1': 'Security sign-off received. Ensure the infosec report is stored in the project documentation for audit purposes.',
  't-sec2': 'Threat model complete. Share findings with the Architecture group — some threats may require design changes.',
  't-sec3': 'AuthN/AuthZ design confirmed. Ensure the implementation is reviewed in code review against this design.',
  't-sec4': 'Pen test scheduled. Ensure findings are tracked and all critical/high issues are resolved before go-live.',
  't-sec5': 'Secrets management confirmed. Run a secrets scan in CI to catch any accidental commits.',
  // Tech – Frontend
  't-fe1': 'Component compliance confirmed. Flag any approved deviations to the design system team.',
  't-fe2': 'Cross-browser testing complete. Ensure results are documented and any known issues are tracked.',
  't-fe3': 'Performance budget set. Integrate Web Vitals monitoring into your CI pipeline to catch regressions early.',
  't-fe4': 'Asset optimisation confirmed. Add a bundle size check to CI to prevent future regressions.',
  't-fe5': 'Analytics implemented. Confirm events are firing correctly in a staging environment before go-live.',
  // Tech – Backend
  't-be1': 'API contracts defined. Pin the consumer versions now to avoid silent breaking changes.',
  't-be2': 'Rate limits documented. Add monitoring alerts for rate-limit responses so you get early warning before users are impacted.',
  't-be3': 'Error handling confirmed. Add integration tests for failure paths to prevent regression.',
  't-be4': 'Auth method confirmed. Ensure the implementation is reviewed against OWASP API Security Top 10.',
  't-be5': 'Job queue design reviewed. Confirm dead-letter queue alerts are configured before go-live.',
  // Tech – QA
  't-qa1': 'QA test plan signed off. Share the plan with the product owner to confirm coverage matches acceptance criteria.',
  't-qa2': 'E2E coverage confirmed. Ensure tests are running in CI on every PR against the main branch.',
  't-qa3': 'Regression suite updated. Schedule a full regression run before the release window.',
  't-qa4': 'Performance testing complete. Document results and set them as the baseline for future comparisons.',
  't-qa5': 'UAT signed off. Capture any feedback in the issue tracker even if it is post-launch work.',
  // Tech – TechOps
  't-o1': 'Runbook updated. Make sure the on-call rotation includes at least one engineer familiar with this feature.',
  't-o2': 'Performance impact assessed. Set a performance budget and add automated regression tests to catch degradation in CI.',
  't-o3': 'Monitoring configured. Conduct a chaos engineering drill or tabletop exercise before go-live.',
  't-o4': 'Deployment runbook documented. Walk through it with the deployment team before the release window.',
  't-o5': 'Rollback tested. Document the test result and the time taken — this is your recovery time objective benchmark.',
  // Marketing
  'm1': 'GTM plan documented. Ensure the launch date in the plan matches what is agreed with PM.',
  'm2': 'Launch comms reviewed. Confirm distribution list and send schedule are finalised.',
  'm3': 'Messaging aligned. Share final messaging with the product owner and support team before launch.',
  'm4': 'Launch date confirmed. Block it in the shared calendar and notify all stakeholders.',
  'm5': 'Content approved. Confirm the publication workflow and who has final publish access.',
  'm6': 'Enablement materials ready. Schedule a walkthrough session with the support and sales teams before launch.',
};
