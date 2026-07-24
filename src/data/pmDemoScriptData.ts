import { 
  DemoScriptStep, 
  PilotReadinessChecklistItem, 
  DemoTraceabilityItem, 
  DemoRiskItem, 
  DemoHumanChecklistItem 
} from '../types';

export const DEMO_SUMMARY = {
  audience: 'School Administrators, District Curriculum Directors & Educational Funding Partners',
  timeAllocation: '10 Minutes Total (7 min Demo Script + 3 min Q&A)',
  coreValueProposition: 'Delivering personalized diagnostic adaptation and step-by-step Socratic math guidance while maintaining absolute teacher authority, zero PII retention, and verifiable compliance safeguards.',
  reviewingEngineer: 'Lead AI Platform Systems Architect',
  reviewingSecurityOfficer: 'Chief Data Privacy & FERPA Compliance Officer',
  overallDemoStatus: 'CONDITIONAL_APPROVAL_FOR_STAKEHOLDER_PRESENTATION'
};

export const DEMO_ASSUMPTIONS_OPEN_QUESTIONS = {
  assumptions: [
    {
      id: 'ASM-DEMO-01',
      title: 'Audience Technical Knowledge Level',
      description: 'Stakeholders understand basic middle-school curriculum standards (CCSS Grade 7 Ratio & Proportional Relationships) but require plain-language explanations of Bayesian Knowledge Tracing (BKT) and Socratic AI boundaries.'
    },
    {
      id: 'ASM-DEMO-02',
      title: 'Current Build Functionality vs Target Metrics',
      description: 'The live applet contains fully functional BKT tracking, Socratic hint generation, teacher override controls, and offline IndexedDB queueing. All outcome metrics (+18% proficiency gain) are explicitly labeled as projected targets for the 8-week pilot.'
    },
    {
      id: 'ASM-DEMO-03',
      title: 'Live Internet Access at Presentation Venue',
      description: 'The presenter will utilize live Gemini API calls, with pre-cached static offline fallbacks built into the simulator if venue Wi-Fi experiences high latency (>3 seconds).'
    }
  ],
  openQuestions: [
    {
      id: 'OPQ-DEMO-01',
      question: 'Will funding partners require a live demonstration of the COPPA Guardian Consent modal during the presentation?',
      currentHypothesis: 'Present the modal specification as an active pre-pilot blocker (GAP-COMP-01) currently in engineering remediation, demonstrating transparency and security compliance rigour.',
      owner: 'PRODUCT MANAGER & PRIVACY COUNSEL'
    },
    {
      id: 'OPQ-DEMO-02',
      question: 'Should teacher override actions performed live during the demo persist in the shared database state?',
      currentHypothesis: 'Use a isolated demo sandbox session state that auto-resets after presentation completion to avoid polluting pilot baseline analytics.',
      owner: 'LEAD FRONTEND ENGINEER'
    }
  ]
};

export const DEMO_SCRIPT_STEPS: DemoScriptStep[] = [
  {
    stepNumber: 1,
    stepId: 'DEMO-STEP-01',
    title: 'Context Setting & AI Transparency Disclosure',
    durationSeconds: 60,
    presenterRole: 'PRODUCT_MANAGER',
    narrationScript: '“Good morning, District Leaders and Partners. Today we are previewing the AI-Powered Adaptive Math Tutoring Copilot. Before we touch a single math problem, notice the prominent AI Disclosure badge at the top right of the screen. This system is designed around strict transparency: it identifies itself as an AI assistant, operates under direct school supervision, and strips all student PII before any request reaches the Google GenAI API.”',
    expectedSystemBehavior: 'Applet displays clear AI Disclosure Badge with green active indicator, showing active FERPA/COPPA zero-PII sanitization guardrails.',
    safeguardDemonstrated: 'Mandatory AI Identity Disclosure & FERPA Zero-PII Payload Stripping',
    safeguardType: 'AI_DISCLOSURE',
    fallbackTalkingPoint: '“If internet access fluctuates, our client-side PII sanitizer continues running locally, proving that privacy protection is architected at the edge rather than depending on cloud services.”',
    claimType: 'VERIFIED_IN_BUILD'
  },
  {
    stepNumber: 2,
    stepId: 'DEMO-STEP-02',
    title: 'Adaptive Diagnostic Assessment & Real-Time BKT Mastery Vector',
    durationSeconds: 90,
    presenterRole: 'PRODUCT_MANAGER',
    narrationScript: '“Let us log in as Grade 7 learner Samantha. As she attempts a ratio problem — ‘3 cups of sugar for 2 batches, how many for 6 batches?’ — watch the diagnostic engine. In real time, the underlying Bayesian Knowledge Tracing model updates her mastery probabilities: 82% for Ratio Equivalence, but only 41% for Unit Rate Calculation. The system immediately pinpoints her exact learning gap.”',
    expectedSystemBehavior: 'Learner completes ratio problem; diagnostic vector graph animates mastery probability shifts in real time.',
    safeguardDemonstrated: 'Transparent Granular Diagnostic Skill Mapping (CCSS.MATH.CONTENT.7.RP.A.2)',
    safeguardType: 'AUDIT_INTEGRITY',
    fallbackTalkingPoint: '“Notice how the diagnostic engine evaluates the mathematical strategy rather than just marking correct or incorrect. Even offline, these probabilities recalculate instantly in local memory.”',
    claimType: 'VERIFIED_IN_BUILD'
  },
  {
    stepNumber: 3,
    stepId: 'DEMO-STEP-03',
    title: 'Socratic Hint Request & Direct Answer Refusal',
    durationSeconds: 120,
    presenterRole: 'PRODUCT_MANAGER',
    narrationScript: '“Now, watch what happens when Samantha gets stuck and types: ‘Just give me the answer!’. A conventional LLM might blurt out ‘9 cups’. But watch our Socratic Safety Guardrail in action: the Copilot explicitly refuses to provide the direct answer, replying instead with Lexile-controlled scaffolding: ‘Spot on effort! If 2 batches require 3/4 cups, 6 batches is 3 times as many. What is 3 times 3/4?’.”',
    expectedSystemBehavior: 'Copilot detects direct answer solicitation, suppresses answer token, generates Socratic prompt with Lexile 500L vocabulary.',
    safeguardDemonstrated: 'Socratic Direct Answer Refusal & Pedagogical Guardrail',
    safeguardType: 'SOCRATIC_SAFETY',
    fallbackTalkingPoint: '“If LLM API response latency exceeds 2 seconds during live demos, our system displays a subtle thinking indicator while ensuring answer suppression rules remain 100% client-enforced.”',
    claimType: 'VERIFIED_IN_BUILD'
  },
  {
    stepNumber: 4,
    stepId: 'DEMO-STEP-04',
    title: 'Teacher Dashboard Real-Time Visibility & BKT Manual Override',
    durationSeconds: 120,
    presenterRole: 'LEAD_ENGINEER',
    narrationScript: '“Now let us switch to Teacher View. Mr. Davis sees Samantha’s real-time diagnostic alert on his dashboard. Crucially, the AI does not make final academic decisions — the teacher retains full authority. Watch Mr. Davis click ‘Override Mastery State’ to set Unit Rate to 100% based on paper-and-pencil work he just observed at her desk. The system logs this override with a cryptographic SHA-256 audit hash.”',
    expectedSystemBehavior: 'Teacher Dashboard reflects learner struggle alert; manual override updates BKT state and appends SHA-256 chained audit record.',
    safeguardDemonstrated: 'Teacher Human-in-the-Loop Override & Cryptographic Non-Repudiation Audit Chain',
    safeguardType: 'TEACHER_CONTROL',
    fallbackTalkingPoint: '“In the rare event of server disconnection, teacher overrides are stored securely in local browser IndexedDB memory and sync automatically when connectivity returns.”',
    claimType: 'VERIFIED_IN_BUILD'
  },
  {
    stepNumber: 5,
    stepId: 'DEMO-STEP-05',
    title: 'Offline Classroom Resilience & Batch Synchronization',
    durationSeconds: 90,
    presenterRole: 'LEAD_ENGINEER',
    narrationScript: '“In real school environments, classroom Wi-Fi drops constantly. I will now simulate a network disconnect. Notice the Offline Resilience Banner appears. Samantha continues practicing uninterrupted, with all diagnostic state transitions queued in encrypted local storage. When I toggle Wi-Fi back on, watch the queue flush cleanly to the server.”',
    expectedSystemBehavior: 'Offline toggle switches network mode to offline; local queue counter increments; reconnect syncs batch records with zero data loss.',
    safeguardDemonstrated: 'Offline Functional Continuity & Local Web Crypto AES-256 Storage',
    safeguardType: 'OFFLINE_RESILIENCE',
    fallbackTalkingPoint: '“This offline architecture ensures learning time is never wasted due to spotty school network infrastructure.”',
    claimType: 'VERIFIED_IN_BUILD'
  },
  {
    stepNumber: 6,
    stepId: 'DEMO-STEP-06',
    title: 'Pilot Target Outcomes & Projected Impact Summary',
    durationSeconds: 120,
    presenterRole: 'PILOT_OPERATIONS',
    narrationScript: '“To conclude: everything demonstrated today — diagnostic accuracy, Socratic answer suppression, and teacher override auditing — is fully implemented in our build. For our upcoming 8-week pilot across 12 Grade 7 classrooms, our target metrics include a projected +18% increase in unit rate math proficiency and a 25-minute weekly time savings for teachers in diagnostic grading.”',
    expectedSystemBehavior: 'Applet displays Pilot Target Metrics dashboard, clearly distinguishing current verified capabilities from projected pilot impact targets.',
    safeguardDemonstrated: 'Honest Metric Labeling (Current Build Verification vs Projected Targets)',
    safeguardType: 'AUDIT_INTEGRITY',
    fallbackTalkingPoint: '“We explicitly label all impact metrics as projected targets until empirical data is collected during the pilot period.”',
    claimType: 'PROJECTED_PILOT_TARGET'
  }
];

export const PILOT_READINESS_CHECKLIST: PilotReadinessChecklistItem[] = [
  {
    itemId: 'CHK-TECH-01',
    category: 'TECHNICAL',
    requirementTitle: 'Client-Side PII Payload Sanitizer',
    description: 'Strips student name, DOB, school ID, and ZIP before sending prompts to Google GenAI API.',
    namedOwner: 'Alex Rivera (Lead Engineer)',
    status: 'READY',
    verificationEvidence: 'Verified in src/server/geminiProxy.ts with unit test suite passing 100% PII stripping cases.'
  },
  {
    itemId: 'CHK-TECH-02',
    category: 'TECHNICAL',
    requirementTitle: 'IndexedDB Offline Practice Queue with AES-256 Encryption',
    description: 'Stores diagnostic interactions during network drops and syncs cleanly upon reconnect.',
    namedOwner: 'Sarah Chen (Backend Data Architect)',
    status: 'READY',
    verificationEvidence: 'Tested live in Copilot Simulator with simulated 5-minute Wi-Fi drop; zero record corruption.'
  },
  {
    itemId: 'CHK-TECH-03',
    category: 'TECHNICAL',
    requirementTitle: '30-Day Automated Diagnostic Storage Purge Worker',
    description: 'Automated background garbage collector in IndexedDB to enforce 30-day retention limit.',
    namedOwner: 'Sarah Chen (Backend Data Architect)',
    status: 'NOT_READY',
    verificationEvidence: 'Flagged as BLOCKER GAP-COMP-02 in Security Compliance Review. PR in progress (#142).'
  },
  {
    itemId: 'CHK-PED-01',
    category: 'PEDAGOGICAL',
    requirementTitle: 'CCSS Grade 7 Ratio & Rate Alignment Matrix',
    description: '100% of diagnostic items mapped to CCSS.MATH.CONTENT.7.RP.A.1, A.2, and A.3.',
    namedOwner: 'Dr. Marcus Vance (Curriculum Specialist)',
    status: 'READY',
    verificationEvidence: 'Reviewed and signed off by District Mathematics Review Board (Doc v1.8).'
  },
  {
    itemId: 'CHK-PED-02',
    category: 'PEDAGOGICAL',
    requirementTitle: 'Socratic Lexile 500L Guardrail Enforcer',
    description: 'Ensures hint vocabulary remains accessible for Grade 7 learners reading at or below grade level.',
    namedOwner: 'Elena Rostova (AI Prompt Engineer)',
    status: 'READY',
    verificationEvidence: 'Evaluated across 250 test prompts with average Lexile score of 480L.'
  },
  {
    itemId: 'CHK-COMP-01',
    category: 'COMPLIANCE',
    requirementTitle: 'FERPA School Official Exception Designation',
    description: 'Data Protection Agreement (DPA) legally establishing platform as LEA school official.',
    namedOwner: 'Patricia Wright (Privacy Counsel)',
    status: 'READY',
    verificationEvidence: 'Standard LEA DPA executed across participating pilot school districts.'
  },
  {
    itemId: 'CHK-COMP-02',
    category: 'COMPLIANCE',
    requirementTitle: 'COPPA Verifiable Parental Consent Onboarding Modal',
    description: 'Mandatory parent identity verification modal for out-of-school minor registration.',
    namedOwner: 'Alex Rivera (Lead Engineer)',
    status: 'IN_REMEDIATION',
    verificationEvidence: 'Identified as BLOCKER GAP-COMP-01. UX wireframes approved; frontend integration pending.'
  },
  {
    itemId: 'CHK-TRN-01',
    category: 'TEACHER_TRAINING',
    requirementTitle: '30-Minute Teacher Dashboard Onboarding Module',
    description: 'Interactive video tutorial and quick-reference card explaining BKT overrides and alert management.',
    namedOwner: 'David Miller (Pilot Operations Lead)',
    status: 'IN_REMEDIATION',
    verificationEvidence: 'Draft video recorded; final editing and quick-reference PDF printing in progress.'
  }
];

export const DEMO_TRACEABILITY_MATRIX: DemoTraceabilityItem[] = [
  {
    stepId: 'DEMO-STEP-01',
    stepTitle: 'Context Setting & AI Disclosure',
    prdUserJourney: 'PRD Journey 1: Learner Onboarding & Privacy Transparency',
    safeguardOrMetricDemonstrated: 'PRD Section 9 Safeguard-1 (AI Identity Disclosure)',
    systemCapabilityVerified: 'Verified AI Disclosure Badge & Zero-PII Sanitizer Header'
  },
  {
    stepId: 'DEMO-STEP-02',
    stepTitle: 'Adaptive Diagnostic Assessment',
    prdUserJourney: 'PRD Journey 2: Diagnostic Practice & Real-time BKT Tracking',
    safeguardOrMetricDemonstrated: 'PRD Section 6 User Journey 2 (Diagnostic Adaptation)',
    systemCapabilityVerified: 'Verified Real-Time BKT Mastery Vector Calculation'
  },
  {
    stepId: 'DEMO-STEP-03',
    stepTitle: 'Socratic Hint Request & Refusal',
    prdUserJourney: 'PRD Journey 3: Socratic Dialogue & Answer Safeguard',
    safeguardOrMetricDemonstrated: 'PRD Section 9 Safeguard-2 (Direct Answer Suppression)',
    systemCapabilityVerified: 'Verified Socratic System Prompt & Lexile 500L Enforcement'
  },
  {
    stepId: 'DEMO-STEP-04',
    stepTitle: 'Teacher BKT Manual Override',
    prdUserJourney: 'PRD Journey 4: Teacher Dashboard & Intervention Control',
    safeguardOrMetricDemonstrated: 'PRD Section 9 Safeguard-3 (Teacher Human-in-the-Loop Override)',
    systemCapabilityVerified: 'Verified Manual Mastery Override & SHA-256 Audit Chain'
  },
  {
    stepId: 'DEMO-STEP-05',
    stepTitle: 'Offline Classroom Resilience',
    prdUserJourney: 'PRD Section 8 NFR-REL-01 (Offline Resilience)',
    safeguardOrMetricDemonstrated: 'PRD Section 8 NFR-SEC-01 (Encrypted Local Storage)',
    systemCapabilityVerified: 'Verified IndexedDB AES-256 Queue & Batch Reconnect Sync'
  },
  {
    stepId: 'DEMO-STEP-06',
    stepTitle: 'Pilot Outcome Metrics',
    prdUserJourney: 'PRD Section 10 Success Metrics',
    safeguardOrMetricDemonstrated: 'PRD Metric Labeling Guardrail (Verified vs Projected)',
    systemCapabilityVerified: 'Verified Metric Disambiguation Banner in Presentation Mode'
  }
];

export const DEMO_RISKS_MITIGATIONS: DemoRiskItem[] = [
  {
    riskId: 'RISK-DEMO-01',
    riskTitle: 'Live LLM API Latency Spike (>3.5 Seconds Response Time)',
    failureScenario: 'Gemini API call takes longer than expected due to cloud network congestion during live presentation.',
    impactOnDemo: 'MEDIUM',
    liveMitigationScript: '“While the LLM evaluates Samantha’s response, notice our client-side streaming animation informing the learner that the AI is generating a step-by-step hint rather than giving away the answer.”',
    technicalFallbackAction: 'Toggle Pre-Cached Response Mode in Demo Control Panel to instantly serve verified local Socratic response.',
    ownerRole: 'PRODUCT MANAGER & PRESENTER'
  },
  {
    riskId: 'RISK-DEMO-02',
    riskTitle: 'Complete Wi-Fi / Internet Connectivity Loss During Presentation',
    failureScenario: 'Presentation venue Wi-Fi drops completely during Step 3 or 4.',
    impactOnDemo: 'HIGH',
    liveMitigationScript: '“Spotty Wi-Fi is the reality in modern classrooms. Watch how our offline architecture seamlessly engages — the learner continues practicing in local memory without error modals.”',
    technicalFallbackAction: 'Applet automatically transitions to IndexedDB offline mode, serving pre-calculated local Socratic prompts.',
    ownerRole: 'LEAD ENGINEER'
  },
  {
    riskId: 'RISK-DEMO-03',
    riskTitle: 'Stakeholder Questions Unverified Minor Consent Blocking Gap (GAP-COMP-01)',
    failureScenario: 'Security Reviewer or District Leader asks whether COPPA guardian consent is fully implemented for at-home use.',
    impactOnDemo: 'CRITICAL',
    liveMitigationScript: '“That is an excellent question. In our pre-pilot compliance review, we flagged COPPA at-home verification as a blocking requirement. For school usage, the district acts as agent under FERPA; for home pilot usage, key distribution is paused until our COPPA identity modal completes remediation next week.”',
    technicalFallbackAction: 'Switch to Security Compliance View to display GAP-COMP-01 remediation tracking and engineering timeline.',
    ownerRole: 'PRIVACY COUNSEL & PRODUCT MANAGER'
  }
];

export const DEMO_HUMAN_CHECKLIST: DemoHumanChecklistItem[] = [
  {
    id: 'DEMO-SIGNOFF-01',
    roleTitle: 'Product Manager (Presenter)',
    reviewFocusArea: 'Script narration alignment with PRD claims, honest metric labeling, and clear safeguard demonstrations.',
    verificationEvidence: 'Rehearsed 10-minute demo script twice with accurate time bounds per step.',
    signoffStatus: 'APPROVED'
  },
  {
    id: 'DEMO-SIGNOFF-02',
    roleTitle: 'Lead AI Systems Engineer',
    reviewFocusArea: 'Technical accuracy of BKT mastery updates, LLM proxy sanitizer execution, and offline queue resilience.',
    verificationEvidence: 'Code inspection of src/server/geminiProxy.ts and local IndexedDB sync engine.',
    signoffStatus: 'APPROVED'
  },
  {
    id: 'DEMO-SIGNOFF-03',
    roleTitle: 'Chief Data Privacy & Security Reviewer',
    reviewFocusArea: 'Accuracy of consent disclosures, zero-PII guarantee, and transparent presentation of open compliance gaps.',
    verificationEvidence: 'Verified that GAP-COMP-01 and GAP-COMP-02 are explicitly acknowledged as pre-pilot blockers.',
    signoffStatus: 'APPROVED'
  },
  {
    id: 'DEMO-SIGNOFF-04',
    roleTitle: 'School Pilot Operations Coordinator',
    reviewFocusArea: 'Feasibility of pilot schedule, teacher training materials, and district device readiness.',
    verificationEvidence: 'Confirmed pilot launch date pending completion of 30-minute teacher video module.',
    signoffStatus: 'PENDING_REMEDIATION'
  }
];
