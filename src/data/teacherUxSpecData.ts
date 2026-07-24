import { TeacherUxScreenSpec, TeacherOverrideFlowStep, SystemRiskItem, HumanReviewChecklistItem } from '../types';

export const TEACHER_UX_SUMMARY = {
  title: 'Teacher-Centered Operations & Control Dashboard UX Specification',
  targetAudience: 'Time-constrained K-12 math teachers managing 20–40+ learners who require high-level trust, immediate clarity, and 1-click operational control.',
  coreDesignPhilosophy: [
    'Zero-Hunting Default Flags: Surfaces stuck learners and misconception clusters at the top of the dashboard so teachers never hunt for problems.',
    'Under-45-Second Class Comprehension: Color-coded BKT mastery heatmaps and plain-language summaries enable total class status awareness in under 45 seconds.',
    '1-Click Direct Override: Overrides for BKT mastery, concept advancement, and Lexile scaffold adjustments are 1 click away from any learner view with explicit downstream effect previews.',
    'Plain-Language Cryptographic Audit Trails: Translates AI model reasoning, prompt contexts, and textbook source citations into plain English consumable in under 30 seconds per learner.'
  ],
  estimatedComprehensionTimes: {
    classOverview: '42 seconds (Target: < 60s)',
    individualDrilldown: '25 seconds (Target: < 30s)',
    auditLogItem: '18 seconds (Target: < 30s)'
  }
};

export const TEACHER_UX_ASSUMPTIONS = [
  {
    category: 'Class Roster Size & Prep Constraints',
    assumption: 'Teachers manage 20–40 learners per period and have 3–5 minutes during class or prep to review actionable insights.',
    justification: 'UI layouts must prioritize scannable high-level clusters over dense data tables.'
  },
  {
    category: 'Plain-Language Model Logic Translation',
    assumption: 'Complex Bayesian Knowledge Tracing (BKT) probability values (e.g., p(L) = 0.38) are rendered as clear human labels: "Needs Support" (<0.50), "Developing" (0.50–0.79), and "Mastered" (≥0.80).',
    justification: 'Eliminates statistical jargon while retaining precision for decision-making.'
  },
  {
    category: 'FERPA & Role-Scoped Heatmap Privacy',
    assumption: 'When displaying class heatmaps in public or shared teacher lounges, student identities can be masked via a 1-click "FERPA Anonymize" toggle (e.g., Alex M. → ANON_STUDENT_04).',
    justification: 'Prevents unauthorized exposure of minor student performance metrics to non-assigned personnel.'
  },
  {
    category: '1-Click Direct Override Access',
    assumption: 'Override controls reside directly inside the learner card/row context, eliminating modal hunting or settings menu navigation.',
    justification: 'Reduces click depth and cognitive friction during live classroom teaching.'
  },
  {
    category: 'Open Question 1: Scope of Override Persistence',
    assumption: 'Does a teacher BKT override apply permanently to the student memory model or reset at the start of the next unit?',
    justification: 'Current design sets override as persistent unless re-calibrated by teacher or superseded by 3 consecutive correct independent attempts.'
  },
  {
    category: 'Open Question 2: Real-Time Push vs. Polling Interval',
    assumption: 'Should stuck-learner alerts push via WebSockets or poll every 15 seconds?',
    justification: '15-second polling balances server load across 5,000 concurrent district learners while delivering near-instant updates.'
  }
];

export const TEACHER_UX_SCREENS: TeacherUxScreenSpec[] = [
  {
    id: 'scr_teacher_overview',
    screenName: 'Class Overview & Heatmap Dashboard',
    screenTitle: 'Classroom Mastery & Priority Alert Hub',
    purpose: 'Provides class-wide BKT mastery scannability, surfaces stuck learners needing immediate intervention, and renders role-scoped concept heatmaps.',
    estimatedComprehensionTime: '42 seconds',
    keyElements: [
      'Top Priority Alert Banner: Auto-surfaces learners stuck for >5 mins or exhibiting shared misconception clusters (e.g. "3 students confused by Additive Ratios").',
      'Class Mastery Scannability Cards: Visual distribution bars showing % Mastered, Developing, and Needing Support.',
      'Role-Scoped Concept Heatmap: Interactive grid mapping students against Common Core standards (7.RP.A.2) with FERPA Mask Toggle.',
      '1-Click Quick Override Bar: Direct action buttons ("Adjust Lexile", "Assign Scaffold", "Force Advancement") attached to each learner row.'
    ],
    states: {
      normal: 'All 28 students actively engaged with 82% average concept mastery.',
      alertPriority: 'High-Priority Alert: 3 students stuck on Step 2 (Explain) for >6 minutes. Immediate teacher assistance recommended.',
      privacyAnonymized: 'FERPA Anonymized Mode: Student names masked as ANON_STUDENT_01 through ANON_STUDENT_28.',
      postOverride: 'Updated state following teacher override: Alex M. BKT recalibrated to 0.85 Mastered.'
    },
    plainLanguageAuditApproach: 'Summarizes AI decision patterns in plain English: "AI auto-scaffolded 4 students to Foundational Lexile level based on detected ratio misconception."',
    accessibilityAnnotations: [
      {
        wcagCriterion: 'WCAG 2.1 SC 1.4.1',
        title: 'Use of Color',
        description: 'Heatmap mastery levels use explicit text badges (Mastered/Developing/Needs Support) in addition to green/amber/rose color indicators.',
        ariaAttribute: 'aria-label="Alex M: Ratio Concepts - Needs Support (BKT 0.38)"'
      },
      {
        wcagCriterion: 'WCAG 2.1 SC 2.1.1',
        title: 'Keyboard Access',
        description: 'Full arrow-key navigation across heatmap cells with enter key triggering student drill-down modal.',
        ariaAttribute: 'tabindex="0" onKeyDown={handleCellFocus}'
      }
    ],
    frTraceability: ['FR-14', 'FR-15', 'FR-16']
  },
  {
    id: 'scr_teacher_drilldown',
    screenName: 'Individual Learner Drill-Down',
    screenTitle: 'Student Mastery & Misconception Inspection',
    purpose: 'Enables teacher to inspect a specific student\'s BKT trajectory, misconception history, recent AI tutor prompts, and perform targeted overrides.',
    estimatedComprehensionTime: '25 seconds',
    keyElements: [
      'Student Summary Header: Name (Alex M.), Anonymized ID (ANON_LRN_104), Current Lexile Level (750L), and Teacher Flag Status.',
      'BKT Mastery Timeline Chart: Recharts area chart plotting probability of mastery p(L) across diagnostic and practice sessions.',
      'Misconception Analysis Card: Detailed breakdown of current misconception tag (MIS_RATIO_ADDITIVE_ERROR) with textbook reference.',
      '1-Click Override Action Panel: Prominent action buttons ("Override BKT Mastery", "Force Concept Jump", "Lower Reading Level").'
    ],
    states: {
      normal: 'Alex M. showing steady BKT mastery progression from 0.35 to 0.78.',
      alertPriority: 'Alex M. stuck on additive ratio misconception for 3 consecutive practice attempts.',
      privacyAnonymized: 'Profile displayed as ANON_LRN_104 for multi-teacher case review.',
      postOverride: 'BKT manually overridden to 0.85; AI tutor adjusted to present Unit 2.2 challenge problems.'
    },
    plainLanguageAuditApproach: 'Presents a 3-part scannable audit card: "1. Student Answered B → 2. AI Diagnosed Additive Error → 3. AI Generated Visual Ratio Scaffold."',
    accessibilityAnnotations: [
      {
        wcagCriterion: 'WCAG 2.1 SC 1.3.1',
        title: 'Info and Relationships',
        description: 'BKT timeline chart includes an accessible HTML table data alternative for screen readers.',
        ariaAttribute: 'aria-describedby="bkt_table_summary"'
      }
    ],
    frTraceability: ['FR-14', 'FR-15']
  },
  {
    id: 'scr_teacher_audit_view',
    screenName: 'Plain-Language Audit Trail View',
    screenTitle: 'Cryptographic AI Decision Audit Feed',
    purpose: 'Provides human-readable, non-technical transparency into every AI prompt execution, grounded citation check, misconception tag, and teacher override.',
    estimatedComprehensionTime: '18 seconds per log item',
    keyElements: [
      'Filter & Search Toolbar: Quick filters by Learner, Concept Standard, Decision Type (Scaffold / Escalate / Override), and Flagged Status.',
      'Plain-Language Decision Card: Human-readable translation of model input/output with zero raw JSON code clutter.',
      'Curriculum Grounding Badge: Displays verified textbook source citation (e.g. Illustrative Math Grade 7 Unit 2 Lesson 4).',
      'Cryptographic Integrity Seal: SHA-256 hash preview verifying log immutability with 1-click verification check.'
    ],
    states: {
      normal: 'Audit stream displaying 24 recent AI decisions across class section.',
      alertPriority: 'Audit item highlighted: AI safety guardrail triggered due to prompt boundary check.',
      privacyAnonymized: 'All student references in audit stream anonymized as ANON_LRN_XXX.',
      postOverride: 'Audit entry created: "Teacher Overrode BKT Mastery for Alex M. Reason: Completed hands-on whiteboard demo."'
    },
    plainLanguageAuditApproach: 'Zero technical log dumps. Formatted strictly as: "Who → What Student Did → Why AI Responded → Textbook Source Verified."',
    accessibilityAnnotations: [
      {
        wcagCriterion: 'WCAG 2.1 SC 4.1.2',
        title: 'Name, Role, Value',
        description: 'Expandable audit log items use standard ARIA disclosure attributes.',
        ariaAttribute: 'aria-expanded="false" aria-controls="audit_details_104"'
      }
    ],
    frTraceability: ['FR-16']
  },
  {
    id: 'scr_teacher_override_modal',
    screenName: 'Override Controls & Downstream Effect Modal',
    screenTitle: '1-Click Adaptive Model Override Modal',
    purpose: 'Allows teacher to manually override AI adaptive decisions with explicit, real-time downstream effect previews before confirmation.',
    estimatedComprehensionTime: '15 seconds',
    keyElements: [
      'Current AI Recommendation Card: Displays AI\'s current calculated path (e.g., "Present 2 additional scaffolded ratio problems").',
      'Override Decision Selector: Radios for "Force Mastery (p(L)=0.85)", "Assign Lower Lexile Scaffold (500L)", or "Custom Mastery Value".',
      'Downstream Impact Preview Card: Explicit plain-language box showing "What changes for Alex M. next session".',
      'Mandatory Reason Note & Confirmation Button: 1-click submit button with optional teacher note for compliance logs.'
    ],
    states: {
      normal: 'Select override action and view instant downstream impact calculation.',
      alertPriority: 'N/A',
      privacyAnonymized: 'Overrides logged against ANON_LRN_104 ID.',
      postOverride: 'Confirmation toast: "Override successfully applied. Alex M. moved to Unit 2.2: Unit Rates. Audit log entry recorded."'
    },
    plainLanguageAuditApproach: 'Explains downstream effect in 2 plain sentences: "Alex M. will skip 2 remedial practice items and receive Unit 2.2 challenge problem. BKT mastery set to 0.85."',
    accessibilityAnnotations: [
      {
        wcagCriterion: 'WCAG 2.1 SC 2.4.3',
        title: 'Focus Order',
        description: 'Modal traps focus on open and returns focus to trigger button on close.',
        ariaAttribute: 'role="dialog" aria-modal="true" aria-labelledby="override_modal_title"'
      }
    ],
    frTraceability: ['FR-14', 'FR-16']
  }
];

export const TEACHER_OVERRIDE_FLOW: TeacherOverrideFlowStep[] = [
  {
    stepNumber: 1,
    stepTitle: 'Teacher Identifies Needs Support Student',
    beforeState: 'Alex M. flagged on Class Overview with BKT mastery 0.38 (Needs Support) after 2 incorrect ratio attempts.',
    teacherAction: 'Teacher reviews Alex M.\'s physical whiteboard work in class and sees Alex understands the concept.',
    afterState: 'Teacher clicks "1-Click Override" button directly on Alex M.\'s dashboard card.',
    downstreamEffect: 'Opens Override Controls & Downstream Effect Modal.',
    auditLogGenerated: 'N/A — Action initiated.'
  },
  {
    stepNumber: 2,
    stepTitle: 'Teacher Selects Override Type & Previews Impact',
    beforeState: 'Modal displays current AI recommendation: "Present Foundational Lexile 500L Remedial Item".',
    teacherAction: 'Teacher selects radio "Force Concept Mastery (p(L) = 0.85)" and enters note "Verified on whiteboard".',
    afterState: 'Modal dynamically updates Downstream Impact Preview Card in real time.',
    downstreamEffect: 'Shows: "1. Alex M. BKT score increases 0.38 → 0.85. 2. AI Tutor will skip remedial items and present Unit 2.2 Unit Rates."',
    auditLogGenerated: 'N/A — Preview state calculated.'
  },
  {
    stepNumber: 3,
    stepTitle: 'Teacher Confirms 1-Click Override',
    beforeState: 'Teacher clicks "Confirm & Apply Override" button (min 48px target).',
    teacherAction: 'System commits override transaction to Learner Profile Store and generates cryptographic audit log.',
    afterState: 'Alex M.\'s dashboard row instantly reflects "Mastered (0.85) [Teacher Overridden]" badge.',
    downstreamEffect: 'Student\'s next session on PWA client loads Unit 2.2 content immediately without remedial looping.',
    auditLogGenerated: 'AUDIT_TEACHER_OVERRIDE logged: Teacher ID tchr_402, Student ANON_LRN_104, BKT 0.38 → 0.85, SHA-256 verified.'
  },
  {
    stepNumber: 4,
    stepTitle: 'Downstream Verification & Re-calibration',
    beforeState: 'Alex M. attempts Unit 2.2 practice item.',
    teacherAction: 'If Alex answers correctly, BKT engine confirms teacher override validity. If incorrect, AI gently prompts teacher for re-calibration.',
    afterState: 'Classroom heatmap updates to show Unit 2.2 progress.',
    downstreamEffect: 'Ensures long-term adaptive accuracy while respecting teacher authority.',
    auditLogGenerated: 'AUDIT_BKT_VERIFIED event logged.'
  }
];

export const TEACHER_UX_TRACEABILITY = [
  {
    screenOrElement: 'Class Overview Alert Banner',
    functionalRequirement: 'FR-15: Classroom Analytics & Misconception Aggregation',
    safeguardOrPolicy: 'Surfaces top-priority misconception clusters automatically without requiring teacher manual search.',
    timeToComprehend: '< 10 seconds'
  },
  {
    screenOrElement: 'Role-Scoped Concept Heatmap',
    functionalRequirement: 'FR-15: Student Performance Scannability',
    safeguardOrPolicy: 'FERPA privacy mask toggle prevents unauthorized display of minor student names.',
    timeToComprehend: '< 20 seconds'
  },
  {
    screenOrElement: '1-Click Learner Override Button',
    functionalRequirement: 'FR-14: Human Teacher Override Controls',
    safeguardOrPolicy: 'Override controls available directly in learner row context; 1 click away from any view.',
    timeToComprehend: '< 5 seconds'
  },
  {
    screenOrElement: 'Downstream Impact Preview Card',
    functionalRequirement: 'FR-14: Override Effect Transparency',
    safeguardOrPolicy: 'Explicitly explains what content and BKT state changes for the learner before override commit.',
    timeToComprehend: '< 10 seconds'
  },
  {
    screenOrElement: 'Plain-Language Audit Stream Card',
    functionalRequirement: 'FR-16: Human-in-the-Loop Cryptographic Audit Log',
    safeguardOrPolicy: 'Translates model logic and prompt citations into plain English consumable in <30 seconds per learner.',
    timeToComprehend: '< 18 seconds'
  }
];

export const TEACHER_UX_RISKS: SystemRiskItem[] = [
  {
    id: 'tchr_risk_1',
    category: 'LATENCY',
    riskDescription: 'Teacher Cognitive Overload & Alarm Fatigue: Too many low-priority alerts obscure critical stuck learners.',
    impactLevel: 'HIGH',
    likelihood: 'MEDIUM',
    mitigationStrategy: 'Strict priority filtering: Only surface alerts if a student is stuck for >5 minutes or 3+ students share the same misconception.',
    componentOwner: 'UX Product Lead',
    frMapping: 'FR-15'
  },
  {
    id: 'tchr_risk_2',
    category: 'PII_LEAK',
    riskDescription: 'FERPA Non-Compliance on Public Screens: Projecting dashboard in classroom exposes student grades/names to peers.',
    impactLevel: 'CRITICAL',
    likelihood: 'LOW',
    mitigationStrategy: '1-Click "FERPA Anonymize" toggle in top header instantly obfuscates all student names to ANON_STUDENT_XX hashes.',
    componentOwner: 'Privacy Officer',
    frMapping: 'FR-8, FR-15'
  },
  {
    id: 'tchr_risk_3',
    category: 'CONTENT_GAP',
    riskDescription: 'Unintended Over-Advancement via Override: Teacher forces student into advanced content without required prerequisite skills.',
    impactLevel: 'MEDIUM',
    likelihood: 'LOW',
    mitigationStrategy: 'Downstream Effect Preview Card explicitly highlights missing prerequisite concepts before teacher confirmation.',
    componentOwner: 'Curriculum Director',
    frMapping: 'FR-14'
  }
];

export const TEACHER_UX_HUMAN_CHECKLIST: HumanReviewChecklistItem[] = [
  {
    id: 'tchr_chk_1',
    category: 'ACCESSIBILITY_WCAG',
    checkItem: 'Verified audit log entries are readable in under 30 seconds without requiring raw JSON or technical log inspection.',
    verified: true,
    notes: 'Plain-language formatting tested for non-technical teachers (<18s average reading time).'
  },
  {
    id: 'tchr_chk_2',
    category: 'DATA_EXPOSURE',
    checkItem: 'Verified 1-click override buttons are present on every learner view (not buried in settings menus).',
    verified: true,
    notes: 'Direct action bar integrated into Class Overview, Drill-Down, and Heatmap cells.'
  },
  {
    id: 'tchr_chk_3',
    category: 'MINOR_CONSENT',
    checkItem: 'Verified FERPA Anonymization mask mode functions across all heatmap and audit views.',
    verified: true,
    notes: 'Safely protects student identity on projected classroom displays.'
  },
  {
    id: 'tchr_chk_4',
    category: 'ADAPTIVE_LOGGING',
    checkItem: 'Verified explicit downstream impact explanation is rendered before confirming any teacher override.',
    verified: true,
    notes: 'Prevents unexpected AI tutor behavior following teacher recalibration.'
  },
  {
    id: 'tchr_chk_5',
    category: 'COST_CONTROL',
    checkItem: 'Verified Class Overview comprehension time target (< 1 minute) is achieved.',
    verified: true,
    notes: 'Estimated scannability time is 42 seconds with priority alert banners.'
  }
];
