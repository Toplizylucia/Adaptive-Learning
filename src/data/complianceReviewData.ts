import { 
  ComplianceChecklistItem, 
  ComplianceFindingItem, 
  ComplianceTraceabilityItem, 
  ComplianceRiskItem, 
  ComplianceHumanChecklistItem 
} from '../types';

export const COMPLIANCE_SUMMARY = {
  auditorRole: 'Chief Data Privacy Officer & Lead Education Security Reviewer',
  targetRegimes: 'FERPA (34 CFR Part 99) | COPPA (16 CFR Part 312) | GDPR Article 8 (Children\'s Consent) & Article 5 (Data Minimization)',
  reviewVersion: 'v1.0-COMPLIANCE-PRE-PILOT',
  overallStatus: 'CONDITIONAL_APPROVAL_WITH_2_BLOCKING_GAPS',
  executiveSummary: 'This regulatory compliance audit evaluates the AI-Powered Adaptive Math Tutoring & Diagnostic Copilot Loop prior to pilot deployment. The review confirms strong architectural safeguards in LLM PII minimization, SHA-256 cryptographic audit chain logging, and AES-256/TLS 1.3 encryption. However, two BLOCKING compliance gaps are identified: (1) Missing active guardian identity verification for minors under 13 prior to diagnostic data ingestion (COPPA § 312.5), and (2) Absence of an automated 30-day automated record deletion mechanism for transient diagnostic state tokens upon student session termination (FERPA § 99.35 / GDPR Art. 17).'
};

export const COMPLIANCE_ASSUMPTIONS_OPEN_QUESTIONS = {
  assumptions: [
    {
      id: 'COMP_ASM_01',
      title: 'School Official Exception Under FERPA',
      description: 'The pilot operates under the FERPA "School Official Exception" (34 CFR § 99.31(a)(1)(i)(B)), requiring the AI platform to remain under direct institutional control of the LEA (Local Educational Agency) without acquiring ownership of student PII.'
    },
    {
      id: 'COMP_ASM_02',
      title: 'Zero LLM Provider Model Retraining Contract',
      description: 'The underlying LLM service level agreement (SLA) with Google GenAI explicitly guarantees zero data retention for model training, enterprise zero-logging on prompts, and compliance with SOC 2 Type II / ISO 27001 boundaries.'
    },
    {
      id: 'COMP_ASM_03',
      title: 'School-Delivered COPPA Consent Delegation',
      description: 'For school-day usage, the LEA acts as agent for parents to provide COPPA consent solely for educational purposes, provided no commercial profiling or targeted ads occur.'
    }
  ],
  openQuestions: [
    {
      id: 'COMP_OPQ_01',
      question: 'Does the current parent portal consent workflow adequately verify guardian identity for out-of-school/at-home diagnostic practice?',
      currentHypothesis: 'Home usage requires integrating an active knowledge-based verification (KBV) or email-plus-confirmation token step before profile creation.',
      owner: 'LEGAL & COMPLIANCE COUNSEL'
    },
    {
      id: 'COMP_OPQ_02',
      question: 'What is the institutional data retention period mandated by participating LEA district policies for plain-language audit logs?',
      currentHypothesis: 'Audit logs containing teacher override actions must be retained for 3 years to comply with state LEA audit mandates while purging raw interaction traces after 90 days.',
      owner: 'DATA GOVERNANCE LEAD'
    }
  ]
};

// SAMPLE REQUEST / RESPONSE EVIDENCE FOR LLM DATA MINIMIZATION
export const LLM_MINIMIZATION_EVIDENCE = {
  rawLearnerContext: {
    studentRealName: "Samantha Miller",
    studentId: "STU-98421",
    districtZipCode: "90210",
    schoolName: "Lincoln Middle School",
    dateOfBirth: "2013-04-12",
    gradeLevel: "Grade 7",
    bktMasteryVector: { RATIO_EQUIVALENCE: 0.82, UNIT_RATE: 0.41 },
    currentItem: "3/4 cups sugar per 2 batches. How many cups for 6 batches?",
    verbalInputText: "I think you multiply three-fourths by three"
  },
  sanitizedLlmRequestPayload: {
    endpoint: "POST /api/copilot/socratic-hint",
    sanitizedPromptTokens: {
      systemInstruction: "You are a Grade 7 Socratic Math Tutor. Strictly suppress direct answers. Guide the learner step by step using Lexile 500L vocabulary. Zero PII permitted.",
      context: {
        grade: "Grade 7",
        masteryLevel: "INTERMEDIATE_UNIT_RATE",
        misconceptionDetected: "NONE",
        normalizedInput: "I think you multiply 3/4 by 3"
      }
    },
    strippedFields: ["studentRealName", "studentId", "districtZipCode", "schoolName", "dateOfBirth"],
    evidenceRef: "src/server/geminiProxy.ts (Lines 42-88: sanitizeLearnerPayload())"
  },
  llmResponsePayload: {
    status: 200,
    sanitizedOutputText: "Spot on reasoning! If 2 batches need 3/4 cups, then 6 batches is 3 times as much. What is 3 times 3/4?",
    directAnswerSuppressed: true,
    piiDetectedInOutput: false,
    evidenceRef: "src/server/geminiProxy.ts (Lines 90-112: outputContentSafetyClassifier())"
  }
};

// 3. COMPLIANCE CHECKLIST
export const COMPLIANCE_CHECKLIST: ComplianceChecklistItem[] = [
  {
    requirementId: 'REQ-COMP-01',
    requirementTitle: 'Guardian Consent Verification for Minors under 13',
    category: 'CONSENT_MINORS',
    regulatoryClause: 'COPPA 16 CFR § 312.5 / FERPA 34 CFR § 99.30',
    currentStatus: 'GAP',
    evidenceReviewed: 'src/components/LearnerUxSpecView.tsx & src/components/CopilotSimulatorView.tsx - Student self-registration bypasses parent/guardian verification modal.',
    isBlocking: true
  },
  {
    requirementId: 'REQ-COMP-02',
    requirementTitle: 'Strict LLM Data Minimization & PII Stripping',
    category: 'PII_MINIMIZATION',
    regulatoryClause: 'FERPA 34 CFR § 99.31 / GDPR Art. 5(1)(c) Data Minimization',
    currentStatus: 'MET',
    evidenceReviewed: 'LLM Proxy payload inspection in src/server/geminiProxy.ts & verified sample JSON token payload (stripped student name, DOB, school, ZIP).',
    isBlocking: false
  },
  {
    requirementId: 'REQ-COMP-03',
    requirementTitle: 'End-to-End Encryption at Rest & In Transit',
    category: 'ENCRYPTION',
    regulatoryClause: 'FERPA Security Standards / FIPS 140-2 / GDPR Art. 32',
    currentStatus: 'MET',
    evidenceReviewed: 'IndexedDB client storage encrypted with AES-256-GCM; server HTTPS enforce TLS 1.3 / HSTS header configured in nginx.',
    isBlocking: false
  },
  {
    requirementId: 'REQ-COMP-04',
    requirementTitle: 'Role-Based Access Control (RBAC) Isolation',
    category: 'RBAC',
    regulatoryClause: 'FERPA 34 CFR § 99.31(a)(1) Direct Control Rule',
    currentStatus: 'MET',
    evidenceReviewed: 'src/types.ts & src/components/TeacherDashboardView.tsx - Strict role segregation between LEARNER, TEACHER, and DISTRICT_ADMIN views.',
    isBlocking: false
  },
  {
    requirementId: 'REQ-COMP-05',
    requirementTitle: 'Cryptographic Audit Log Integrity & Non-Repudiation',
    category: 'AUDIT_INTEGRITY',
    regulatoryClause: 'FERPA § 99.32 Recordkeeping Requirement / NIST SP 800-92',
    currentStatus: 'MET',
    evidenceReviewed: 'src/utils/auditLogger.ts - SHA-256 hash chaining on all model state mutations and teacher overrides with plain-language summaries.',
    isBlocking: false
  },
  {
    requirementId: 'REQ-COMP-06',
    requirementTitle: 'Automated Diagnostic Record Retention & Erasure',
    category: 'RETENTION_DELETION',
    regulatoryClause: 'GDPR Art. 17 (Right to Erasure) / FERPA § 99.35 Destruction Policy',
    currentStatus: 'PARTIAL',
    evidenceReviewed: 'src/data/diagnosticTaxonomyData.ts - Diagnostic logs retain records indefinitely in IndexedDB without automated 30-day purge worker.',
    isBlocking: font_gap_is_blocking(true)
  }
];

function font_gap_is_blocking(val: boolean): boolean {
  return val;
}

// 4. DETAILED FINDINGS PER GAP
export const COMPLIANCE_FINDINGS: ComplianceFindingItem[] = [
  {
    findingId: 'GAP-COMP-01',
    title: 'Missing Guardian Identity Verification Modal for Out-of-School Minor Consent',
    severity: 'BLOCKING',
    affectedComponent: 'Learner Authentication & Onboarding Workflow (src/components/LearnerUxSpecView.tsx)',
    regulatoryClause: 'COPPA 16 CFR § 312.5 (Verifiable Parental Consent) & FERPA 34 CFR § 99.30',
    rootCause: 'The onboarding workflow allows minor students (<13 years) to initiate adaptive math diagnostic sessions via self-asserted birthdate without capturing parent/guardian email or LEA school delegation token.',
    recommendedFix: 'Implement a mandatory Parental Consent Verification modal requiring either (a) LEA School Administrator Enterprise SSO token, or (b) Guardian email verification with double opt-in link before storing learner diagnostic profiles.',
    assignedOwnerRole: 'LEAD FRONTEND ENGINEER & PRIVACY COUNSEL',
    status: 'OPEN_BLOCKER'
  },
  {
    findingId: 'GAP-COMP-02',
    title: 'Lack of Automated 30-Day Data Retention Purge for Transient Diagnostic State Tokens',
    severity: 'BLOCKING',
    affectedComponent: 'IndexedDB Offline Queue & State Storage (src/utils/auditLogger.ts)',
    regulatoryClause: 'FERPA 34 CFR § 99.35 (Destruction of Personally Identifiable Information) & GDPR Art. 17 (Storage Limitation)',
    rootCause: 'Diagnostic response vectors and verbal speech-to-text audio transcripts persist in local browser IndexedDB storage indefinitely without an automated TTL expiration date or deletion API.',
    recommendedFix: 'Implement an automated background garbage collection routine in IndexedDB setting a strict 30-day TTL on diagnostic session tokens, with explicit "Delete My Data" right-to-be-forgotten button in learner setting menu.',
    assignedOwnerRole: 'BACKEND DATA ARCHITECT',
    status: 'OPEN_BLOCKER'
  },
  {
    findingId: 'GAP-COMP-03',
    title: 'Unencrypted Local Storage Cache for Offline Speech-to-Text Transcripts',
    severity: 'MEDIUM',
    affectedComponent: 'Web Speech API Local Buffer (src/components/CopilotSimulatorView.tsx)',
    regulatoryClause: 'NIST SP 800-88 / FERPA Data Security Recommendations',
    rootCause: 'Verbal response transcripts generated during offline mode are cached in unencrypted localStorage keys before batch sync.',
    recommendedFix: 'Migrate offline speech transcript buffer from unencrypted localStorage to Web Crypto API encrypted IndexedDB store using AES-GCM-256.',
    assignedOwnerRole: 'SECURITY ENGINEER',
    status: 'REMEDIATION_IN_PROGRESS'
  }
];

// 5. TRACEABILITY TABLE
export const COMPLIANCE_TRACEABILITY_MATRIX: ComplianceTraceabilityItem[] = [
  {
    findingId: 'GAP-COMP-01',
    title: 'Unverified Minor Consent Onboarding',
    prdSafeguardOrNfr: 'PRD Safeguard-3 & Section 8 NFR-SEC-02',
    regulatoryFramework: 'COPPA 16 CFR § 312.5 & FERPA § 99.30',
    verificationMethod: 'Interactive UX Consent Flow Code Review'
  },
  {
    findingId: 'GAP-COMP-02',
    title: 'Indefinite Transient Diagnostic Storage',
    prdSafeguardOrNfr: 'PRD Section 8 NFR-DAT-01 (Data Retention)',
    regulatoryFramework: 'FERPA 34 CFR § 99.35 & GDPR Art. 17',
    verificationMethod: 'IndexedDB Garbage Collector Unit Assertion'
  },
  {
    findingId: 'GAP-COMP-03',
    title: 'Unencrypted Offline Audio Transcripts',
    prdSafeguardOrNfr: 'PRD Section 8 NFR-SEC-01 (At-Rest Encryption)',
    regulatoryFramework: 'FIPS 140-2 / FERPA Security Rule',
    verificationMethod: 'Browser Storage Encryption Inspection'
  }
];

// 6. RISKS & MITIGATIONS
export const COMPLIANCE_RISKS: ComplianceRiskItem[] = [
  {
    riskId: 'RISK-COMP-01',
    riskTitle: 'Regulatory Enforcement Fine for COPPA Minor Data Processing Without Verified Consent',
    threatDescription: 'Deploying pilot in LEA districts without verified parental/school consent delegation exposes platform to FTC COPPA monetary penalties ($50,120 per violation).',
    impactLevel: 'CRITICAL',
    mitigationStrategy: 'Enforce BLOCKER GAP-COMP-01 remediation before pilot key issuance. Require signed District Data Protection Agreement (DPA) with explicit school consent delegation clause.',
    residualRisk: 'LOW (Post-Remediation)',
    ownerRole: 'CHIEF LEGAL & PRIVACY OFFICER'
  },
  {
    riskId: 'RISK-COMP-02',
    riskTitle: 'Unintentional LLM Training Data Contamination via Prompt Leakage',
    threatDescription: 'If LLM vendor changes default logging settings, student math queries could be retained for foundation model fine-tuning.',
    impactLevel: 'HIGH',
    mitigationStrategy: 'Contractually bind Google GenAI Enterprise SLA prohibiting data retention. Execute client-side PII stripper in src/server/geminiProxy.ts prior to API invocation.',
    residualRisk: 'NEGLIGIBLE',
    ownerRole: 'LEAD SECURITY ARCHITECT'
  },
  {
    riskId: 'RISK-COMP-03',
    riskTitle: 'Audit Log Hash Tampering in Local Storage Environment',
    threatDescription: 'A malicious local user alters historical audit log entries in IndexedDB to hide teacher override actions.',
    impactLevel: 'MEDIUM',
    mitigationStrategy: 'Validate cryptographic SHA-256 genesis hash chain on app startup. Discrepancy triggers immediate server alert and locks audit view.',
    residualRisk: 'LOW',
    ownerRole: 'QA LEAD & SECURITY AUDITOR'
  }
];

// 7. HUMAN REVIEW SIGNOFF CHECKLIST
export const COMPLIANCE_HUMAN_CHECKLIST: ComplianceHumanChecklistItem[] = [
  {
    id: 'SIGNOFF-01',
    roleTitle: 'Chief Data Privacy Officer & Legal Counsel',
    verificationRequirement: 'Verify that LEA District Data Protection Agreement (DPA) includes FERPA § 99.31 School Official designation and COPPA consent delegation clauses.',
    evidenceVerified: 'Reviewed template DPA Document v2.4 & COPPA Guardian Onboarding Specs.',
    signoffStatus: 'PENDING_REMEDIATION'
  },
  {
    id: 'SIGNOFF-02',
    roleTitle: 'Lead Information Security Auditor',
    verificationRequirement: 'Verify that LLM proxy payload sanitizer strictly strips all PII fields (Name, DOB, ZIP, School ID) prior to Google GenAI API request dispatch.',
    evidenceVerified: 'Reviewed src/server/geminiProxy.ts & verified live sample request JSON log.',
    signoffStatus: 'APPROVED'
  },
  {
    id: 'SIGNOFF-03',
    roleTitle: 'Institutional FERPA Compliance Reviewer',
    verificationRequirement: 'Confirm plain-language audit log generator records all teacher manual BKT model overrides with cryptographically verifiable SHA-256 hashes.',
    evidenceVerified: 'Reviewed src/utils/auditLogger.ts & executed SHA-256 chain verification test.',
    signoffStatus: 'APPROVED'
  },
  {
    id: 'SIGNOFF-04',
    roleTitle: 'Superintendent / LEA Pilot Operations Lead',
    verificationRequirement: 'Confirm student data deletion and right-to-be-forgotten automated workflow is fully operational prior to pilot launch.',
    evidenceVerified: 'Pending verification of 30-day automated IndexedDB purge worker (GAP-COMP-02).',
    signoffStatus: 'PENDING_REMEDIATION'
  }
];
