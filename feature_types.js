/**
 * feature_types.js
 * ─────────────────────────────────────────────────────────────────────────────
 * First-draft classification taxonomy for deciding whether a change requires
 * project initiation through ReadyOps.
 *
 * VERSION: 1.0 — first draft
 *
 * HOW TO READ THIS FILE:
 *   Each entry in FEATURE_TYPES represents a category of change. The system
 *   uses these definitions to guide the user through a two-step classification:
 *
 *   1. Type selection  — user picks the best-matching category.
 *   2. Override check  — if the type has overrideQuestions, the user answers
 *                        yes/no to catch exceptions that flip the verdict.
 *
 * KEY FIELDS:
 *   defaultExempt       {boolean} — true = this type bypasses initiation by
 *                                   default (unless an override question fires).
 *   overrideQuestions   {Array}   — exception conditions. If the user answers
 *                                   "yes" to a question where yesOverrides=true,
 *                                   the verdict flips to "initiation required".
 *   alwaysInitiate      {boolean} — hard rule, no exceptions. Overrides
 *                                   defaultExempt entirely (financial impact).
 *   alwaysInitiateReason {string} — explanation shown when alwaysInitiate=true.
 *
 * TODO (future iterations):
 *   - Add sub-categories / finer-grained types within each category.
 *   - Add a risk score per type to influence gate weighting.
 *   - Link types to gate skip rules (e.g. pure bug fixes could skip Marketing).
 *   - Support multiple type selection for hybrid changes.
 *   - Add owner/approver hints per type (e.g. compliance changes need Legal).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const FEATURE_TYPES = [

  // ── 1. IT STABILITY / CLOUD OPTIMISATION ──────────────────────────────────
  {
    id:          'it-stability',
    label:       'IT Stability / Cloud Optimisation',
    icon:        '☁️',
    description: 'IT-initiated changes targeting systems stability, reliability, or cloud resource optimisation. Must have no impact on customers or external-facing behaviour.',
    examples:    [
      'Auto-scaling rule adjustments',
      'Cloud cost optimisation refactoring',
      'Server resource rebalancing',
      'Monitoring and alerting setup',
      'Log aggregation pipeline change',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'it-customer-impact',
        text:         'Does this change have any impact on customers or external-facing systems — even indirectly?',
        hint:         'e.g. a change that alters response times, availability, or data visible to customers.',
        yesOverrides: true,
      },
    ],
  },

  // ── 2. INTERNAL ARCHITECTURE CHANGE ───────────────────────────────────────
  {
    id:          'internal-architecture',
    label:       'Internal Architecture Change',
    icon:        '🔧',
    description: 'Changes to internal infrastructure such as networking topology, backup systems, or tech stack upgrades. Exempt unless customer impact or downtime is involved.',
    examples:    [
      'Network routing change',
      'Backup strategy or schedule update',
      'Framework or runtime version upgrade',
      'Internal service decomposition',
      'Container orchestration change',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'arch-customer-downtime',
        text:         'Does this change require scheduled downtime or any customer-visible disruption?',
        hint:         'e.g. a database migration that takes the system offline, even briefly.',
        yesOverrides: true,
      },
      {
        id:           'arch-customer-data',
        text:         'Does this change touch customer data, APIs, or systems that customers interact with?',
        hint:         'e.g. migrating a production database, changing an external API contract.',
        yesOverrides: true,
      },
    ],
  },

  // ── 3. INTERNAL UI CHANGE ─────────────────────────────────────────────────
  {
    id:          'internal-ui',
    label:       'Internal UI Change',
    icon:        '🖥️',
    description: 'UI or UX changes to systems used exclusively by internal company staff. The system must not be accessible to or visible by customers.',
    examples:    [
      'Admin panel layout change',
      'Internal dashboard redesign',
      'Staff operations tool update',
      'Back-office form restructure',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'internal-ui-external',
        text:         'Could any part of this UI change affect a system that customers or external users access?',
        hint:         'e.g. a shared component used in both internal and customer-facing interfaces.',
        yesOverrides: true,
      },
    ],
  },

  // ── 4. MANDATORY COMPLIANCE / REGULATORY CHANGE ───────────────────────────
  {
    id:          'compliance-regulatory',
    label:       'Mandatory Compliance / Regulatory Change',
    icon:        '⚖️',
    description: 'Changes required by law, regulation, or an external compliance mandate. Exempt unless the change visibly affects the end-user experience.',
    examples:    [
      'PDPA / GDPR consent mechanism update',
      'Audit log retention enforcement',
      'Data residency policy compliance',
      'Mandatory security control implementation',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'compliance-ux-impact',
        text:         'Does this compliance change affect or alter the end-user experience in any noticeable way?',
        hint:         'e.g. a new consent screen, a change to a visible data field, or altered user workflows.',
        yesOverrides: true,
      },
    ],
  },

  // ── 5. MINOR UI / VISUAL CHANGE ───────────────────────────────────────────
  {
    id:          'minor-ui',
    label:       'Minor UI / Visual Change',
    icon:        '🎨',
    description: 'Small cosmetic or visual changes that can be agreed solely by the product or marketing team, without broader cross-functional sign-off.',
    examples:    [
      'Button border radius adjustment',
      'Colour palette or theme tweak',
      'Font size or spacing change',
      'Icon update or illustration swap',
      'Label copy change',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'minor-ui-broader-approval',
        text:         'Does this change require sign-off from teams beyond product or marketing (e.g. Legal, Compliance, Engineering)?',
        hint:         'e.g. a rebrand that touches legal disclaimers, or a layout change that affects accessibility compliance.',
        yesOverrides: true,
      },
    ],
  },

  // ── 6. BUG FIX ────────────────────────────────────────────────────────────
  {
    id:          'bug-fix',
    label:       'Bug Fix',
    icon:        '🐛',
    description: 'Corrects existing unintended behaviour without introducing any new features, capabilities, or changes to the intended design.',
    examples:    [
      'Fix broken form validation',
      'Correct an off-by-one calculation error',
      'Resolve a display glitch or layout break',
      'Fix an intermittent race condition',
    ],
    defaultExempt: true,
    alwaysInitiate: false,
    overrideQuestions: [
      {
        id:           'bugfix-new-capability',
        text:         'Does this fix introduce any new behaviour, capability, or change to what the system is designed to do?',
        hint:         'e.g. adding a fallback mechanism, changing a rule that users rely on, or altering an API contract.',
        yesOverrides: true,
      },
    ],
  },

  // ── 7. FINANCIAL IMPACT CHANGE ────────────────────────────────────────────
  {
    id:             'financial-impact',
    label:          'Financial Impact Change',
    icon:           '💰',
    description:    'Any change that affects financials, billing logic, pricing structures, or cost models — regardless of whether it surfaces as a customer-visible feature.',
    examples:       [
      'Pricing model or tier update',
      'Billing calculation logic change',
      'Cost centre or budget reallocation',
      'Revenue-sharing or commission logic change',
      'Financial reporting output change',
    ],
    defaultExempt:       false,
    alwaysInitiate:      true,
    alwaysInitiateReason: 'Changes with financial impact always require project initiation, regardless of scope or customer visibility. Financial changes need cross-functional oversight to manage risk.',
    overrideQuestions:   [],
  },

  // ── 8. NEW FEATURE / CAPABILITY ───────────────────────────────────────────
  {
    id:          'new-feature',
    label:       'New Feature / Capability',
    icon:        '✨',
    description: 'A net-new capability, product feature, integration, or customer-facing change that does not fit any of the exempt categories above.',
    examples:    [
      'New user-facing product module',
      'New customer API or integration',
      'New product offering or tier',
      'New workflow or process for customers',
    ],
    defaultExempt:     false,
    alwaysInitiate:    false,
    overrideQuestions: [],
  },

  // ── 9. UNSURE / CANNOT CLASSIFY ───────────────────────────────────────────
  {
    id:               'unsure',
    label:            'Not Sure',
    icon:             '❓',
    description:      'The change does not clearly fit any of the above categories, or spans multiple types.',
    examples:         [
      'A change that is partly a bug fix and partly a new capability',
      'A cross-cutting initiative touching multiple teams and systems',
      'A change with unclear scope or ownership',
    ],
    defaultExempt:       false,
    alwaysInitiate:      true,
    alwaysInitiateReason: 'When a change cannot be clearly classified, initiate a readiness review as a precaution. The review process will help clarify scope, ownership, and risk. You can update the classification later.',
    overrideQuestions:   [],
  },

];

// ── VERDICT MESSAGES ──────────────────────────────────────────────────────────
/**
 * Shown in the green "exempt" callout when no override question fires.
 * Keyed by feature type id.
 */
const EXEMPTION_MESSAGES = {
  'it-stability':          'IT-initiated stability and optimisation changes with no customer impact do not require project initiation through ReadyOps.',
  'internal-architecture': 'Internal architecture changes that do not cause customer-visible impact or downtime do not require project initiation.',
  'internal-ui':           'UI changes to internal staff-only systems do not require project initiation.',
  'compliance-regulatory': 'Mandatory compliance or regulatory changes that do not affect user experience do not require project initiation.',
  'minor-ui':              'Minor visual changes agreed within the product or marketing team do not require project initiation.',
  'bug-fix':               'Bug fixes that do not introduce new features or change intended behaviour do not require project initiation.',
};

/**
 * Shown in the blue "initiation required" callout when an override question
 * flips the verdict. Keyed by override question id.
 */
const OVERRIDE_MESSAGES = {
  'it-customer-impact':       'This change affects customers or external-facing systems, so project initiation is required.',
  'arch-customer-downtime':   'Changes requiring scheduled downtime or customer-visible disruption require project initiation.',
  'arch-customer-data':       'Changes touching customer data, APIs, or customer-facing systems require project initiation.',
  'internal-ui-external':     'Changes that affect systems accessible to customers require project initiation.',
  'compliance-ux-impact':     'Compliance changes that alter the end-user experience require project initiation.',
  'minor-ui-broader-approval':'Changes requiring sign-off beyond product and marketing require project initiation.',
  'bugfix-new-capability':    'Fixes that introduce new behaviour or capabilities are treated as features and require project initiation.',
};

/**
 * Badge colours for the dashboard type pill.
 * Keyed by feature type id. Returns a Tailwind CSS class string.
 */
const FEATURE_TYPE_PILL_COLORS = {
  'it-stability':          'bg-sky-50 text-sky-700 border-sky-200',
  'internal-architecture': 'bg-slate-50 text-slate-700 border-slate-200',
  'internal-ui':           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'compliance-regulatory': 'bg-amber-50 text-amber-700 border-amber-200',
  'minor-ui':              'bg-pink-50 text-pink-700 border-pink-200',
  'bug-fix':               'bg-orange-50 text-orange-700 border-orange-200',
  'financial-impact':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'new-feature':           'bg-purple-50 text-purple-700 border-purple-200',
  'unsure':                'bg-gray-100 text-gray-600 border-gray-300',
};
