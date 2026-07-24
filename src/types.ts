export interface BktMastery {
  skillId: string;
  skillName: string;
  masteryProbability: number; // p(L_k) from 0.0 to 1.0
  attemptsCount: number;
  lastAssessedAt: string;
}

export interface MisconceptionRecord {
  tag: string;
  description: string;
  frequencyCount: number;
  lastObservedAt: string;
  resolved: boolean;
}

export interface LearnerProfile {
  learnerId: string;
  piiScrubbedId: string; // e.g. "ANON_LRN_8492"
  displayName: string;
  schoolId: string;
  schoolName: string;
  gradeLevel: number;
  masteryVector: Record<string, BktMastery>;
  misconceptionHistory: MisconceptionRecord[];
  accessibilityPrefs: {
    readingLevel: 'foundational' | 'standard' | 'advanced';
    textToSpeechEnabled: boolean;
    highContrastMode: boolean;
    stepChunkSize: number;
  };
  offlineSyncCursor: number;
  lastActive: string;
}

export interface PracticeChoice {
  id: string;
  text: string;
  misconceptionTag?: string; // e.g. "MIS_RATIO_ADDITIVE_ERROR"
  misconceptionDescription?: string;
}

export interface PracticeQuestion {
  id: string;
  nodeId: string;
  questionText: string;
  choices: PracticeChoice[];
  correctChoiceId: string;
  difficultyIndex: number; // 0.1 to 1.0
  scaffoldedHints: string[];
}

export interface CurriculumNode {
  id: string;
  title: string;
  subject: string;
  gradeLevel: number;
  learningObjective: string;
  prerequisites: string[];
  nextRecommendedNodes: string[];
  commonMisconceptions: Array<{
    tag: string;
    description: string;
    remediationStrategy: string;
  }>;
  questions: PracticeQuestion[];
}

export type LearnerActionType = 'SUBMIT_ANSWER' | 'REQUEST_HINT' | 'CONFUSION_SIGNAL' | 'OFFLINE_QUEUED_SYNC';

export interface ModelRoutingMetrics {
  tier: 'TIER_1_MICRO_RULE' | 'TIER_2_GEMINI_FLASH' | 'TIER_3_DEEP_REASONING';
  modelName: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  cacheHit: boolean;
  routingReason: string;
}

export interface DiagnosticResult {
  eventId: string;
  timestamp: string;
  learnerId: string;
  piiScrubbedId: string;
  nodeId: string;
  actionType: LearnerActionType;
  isCorrect?: boolean;
  detectedMisconception?: {
    tag: string;
    description: string;
  };
  bktUpdates: Record<string, { oldP: number; newP: number }>;
  generatedExplanation?: string;
  nextRecommendedNodeId: string;
  modelRouting: ModelRoutingMetrics;
  piiCleanStatus: boolean;
  auditHash: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  schoolId: string;
  anonymizedLearnerHash: string;
  actionType: string;
  nodeId: string;
  modelTier: string;
  costUSD: number;
  latencyMs: number;
  piiScrubbed: boolean;
  status: 'SUCCESS' | 'CACHE_FALLBACK' | 'OFFLINE_QUEUED' | 'RATE_LIMITED' | 'RETRY_SUCCESS';
}

export interface ArchitectureSection {
  id: string;
  title: string;
  frNumber: string;
  summary: string;
  contentMarkdown: string;
  subsections?: Array<{
    title: string;
    content: string;
  }>;
}

export interface TraceabilityRow {
  frId: string; // FR-1 to FR-20
  title: string;
  ownerComponent: string;
  description: string;
  safeguard: string;
  testStatus: 'VERIFIED' | 'AUTOMATED_PASS' | 'SIMULATED';
}

export interface SystemRiskItem {
  id: string;
  category: 'LLM_COST' | 'CONNECTIVITY' | 'PII_LEAK' | 'CONTENT_GAP' | 'DATA_SYNC' | 'LATENCY' | 'ACCESSIBILITY' | 'DARK_PATTERN';
  riskDescription: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigationStrategy: string;
  componentOwner: string;
  frMapping: string;
}

export interface DistrictMetrics {
  totalConcurrentLearners: number;
  activeSchools: number;
  totalDailySessions: number;
  avgLatencyMs: number;
  totalDailyCostUSD: number;
  budgetCapUSD: number;
  cacheHitRatePercentage: number;
  offlineQueueCount: number;
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  purpose: string;
  authLevelRequired: 'ROLE_LEARNER' | 'ROLE_TEACHER' | 'ROLE_ADMIN' | 'ROLE_SERVICE';
  costTier: 'TIER_1_MICRO_RULE' | 'TIER_2_GEMINI_FLASH' | 'TIER_0_CACHE_LOOKUP';
  idempotencySupported: boolean;
  rateLimitHeader: string;
  requestSchemaJson: string;
  responseSchemaJson: string;
  sourceCitationRequired: boolean;
  reasonRequired: boolean;
  edgeCases: Array<{
    caseName: string;
    description: string;
    expectedStatusCode: number;
    errorResponseJson: string;
  }>;
  frMappings: string[];
}

export interface ApiErrorCode {
  code: string;
  httpStatus: number;
  meaning: string;
  clientFacingMessage: string;
  retryGuidance: string;
}

export interface HumanReviewChecklistItem {
  id: string;
  category: 'DATA_EXPOSURE' | 'GROUNDING_CITATIONS' | 'ADAPTIVE_LOGGING' | 'IDEMPOTENCY' | 'COST_CONTROL' | 'ACCESSIBILITY_WCAG' | 'MINOR_CONSENT';
  checkItem: string;
  verified: boolean;
  notes: string;
}

export interface UxScreenSpec {
  id: string;
  stepName: 'DIAGNOSE' | 'EXPLAIN' | 'PRACTICE' | 'ADAPT' | 'REFLECT';
  screenTitle: string;
  purpose: string;
  keyElements: string[];
  readingLevelAdaptations: {
    foundational: string;
    standard: string;
    advanced: string;
  };
  states: {
    loading: string;
    emptyColdStart: string;
    offlineError: string;
    success: string;
  };
  accessibilityAnnotations: Array<{
    wcagCriterion: string;
    title: string;
    description: string;
    ariaAttribute: string;
  }>;
  frTraceability: string[];
}

export interface UxUserFlowStep {
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  triggerEvent: string;
  systemAction: string;
  fallbackAction: string;
}

export interface TeacherUxScreenSpec {
  id: string;
  screenName: string;
  screenTitle: string;
  purpose: string;
  estimatedComprehensionTime: string;
  keyElements: string[];
  states: {
    normal: string;
    alertPriority: string;
    privacyAnonymized: string;
    postOverride: string;
  };
  plainLanguageAuditApproach: string;
  accessibilityAnnotations: Array<{
    wcagCriterion: string;
    title: string;
    description: string;
    ariaAttribute: string;
  }>;
  frTraceability: string[];
}

export interface TeacherOverrideFlowStep {
  stepNumber: number;
  stepTitle: string;
  beforeState: string;
  teacherAction: string;
  afterState: string;
  downstreamEffect: string;
  auditLogGenerated: string;
}

// ==========================================
// DIAGNOSTIC MISCONCEPTION TAXONOMY TYPES
// ==========================================

export interface MisconceptionTaxonomyItem {
  misconceptionId: string;
  title: string;
  commonCoreCluster: string;
  description: string;
  typicalErrorSignature: string;
  pedagogicalSource: string;
  validationStatus: 'DRAFT_HYPOTHESIS' | 'EMPIRICALLY_VALIDATED' | 'AWAITING_FIELD_DATA';
  sampleStudentResponse: string;
  remediationApproach: string;
  bktParameters: {
    priorMastery: number; // p(L0)
    transitRate: number;  // p(T)
    slipRate: number;     // p(S)
    guessRate: number;    // p(G)
  };
}

export interface QuestionSelectionNode {
  nodeId: string;
  itemCode: string;
  questionText: string;
  mathTopic: string;
  commonCoreStandard: string;
  options: Array<{
    optionId: string;
    text: string;
    isCorrect: boolean;
    linkedMisconceptionId: string | 'NONE';
    diagnosticRationale: string;
  }>;
  nextStepOnSuccess: string;
  nextStepOnMisconception: Record<string, string>;
}

export interface DiagnosticConfidenceRule {
  level: 'HIGH' | 'MODERATE' | 'LOW';
  probabilityThreshold: string; // e.g. ">= 0.80"
  systemClassificationAction: string;
  learnerFacingInstruction: string;
  teacherDashboardAlert: string;
  auditStreamLogType: string;
}

export interface DiagnosticEdgeCaseHandling {
  caseId: string;
  caseName: string;
  triggerCondition: string;
  classificationBehavior: string;
  fairnessSafeguard: string;
  exampleScenario: string;
}

export interface DiagnosticTraceabilityItem {
  logicElement: string;
  prdRequirement: string;
  pedagogicalOrSecuritySafeguard: string;
  verificationMethod: string;
}

export interface DiagnosticRiskItem {
  riskId: string;
  category: 'PEDAGOGICAL' | 'BIAS_FAIRNESS' | 'TECHNICAL_BOUNDS' | 'DATA_VALIDITY';
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigationStrategy: string;
  ownerRole: string;
}

export interface DiagnosticChecklistItem {
  id: string;
  category: 'PEDAGOGICAL' | 'BIAS_FAIRNESS' | 'BOUNDEDNESS' | 'ACCESSIBILITY' | 'DATA_INTEGRITY';
  checkItem: string;
  verified: boolean;
  notes: string;
}

// ==========================================
// QA TEST PLAN & SECURITY COVERAGE TYPES
// ==========================================

export interface QaTestCaseItem {
  testId: string;
  category: 'UNIT' | 'INTEGRATION' | 'EDGE_CASE' | 'ADVERSARIAL';
  scenario: string;
  input: string;
  expectedOutcome: string;
  passFailCriterion: string;
  relatedFrOrSafeguard: string;
}

export interface AdversarialTestCaseItem {
  testId: string;
  threatType: 'PROMPT_INJECTION' | 'SYSTEM_PROMPT_EXFILTRATION' | 'ANSWER_CHEATING' | 'OFF_CURRICULUM_GENERATION' | 'ADAPTIVE_ENGINE_GAMING' | 'OVER_PERSONALIZATION_LOCK';
  attackVector: string;
  learnerInputPayload: string;
  targetVulnerability: string;
  expectedDefenseResponse: string;
  objectivePassFailCriterion: string;
  securitySeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  relatedFrOrSafeguard: string;
}

export interface QaTraceabilityItem {
  requirementId: string;
  requirementTitle: string;
  coveringTestIds: string[];
  coverageStatus: 'COVERED_100%' | 'GAP_FLAGGED';
  verificationMethod: string;
}

export interface QaRiskItem {
  riskId: string;
  riskTitle: string;
  description: string;
  isUntestable: boolean;
  mitigationStrategy: string;
  ownerRole: string;
}

export interface QaChecklistItem {
  id: string;
  category: string;
  checkItem: string;
  verified: boolean;
  notes: string;
}

// ==========================================
// SECURITY & PRIVACY COMPLIANCE REVIEW TYPES
// ==========================================

export interface ComplianceChecklistItem {
  requirementId: string;
  requirementTitle: string;
  category: 'CONSENT_MINORS' | 'PII_MINIMIZATION' | 'ENCRYPTION' | 'RBAC' | 'AUDIT_INTEGRITY' | 'RETENTION_DELETION';
  regulatoryClause: string; // e.g., 'FERPA 34 CFR § 99.30 / COPPA 16 CFR § 312.5'
  currentStatus: 'MET' | 'PARTIAL' | 'GAP';
  evidenceReviewed: string; // File path, code block, or config verified
  isBlocking: boolean;
}

export interface ComplianceFindingItem {
  findingId: string;
  title: string;
  severity: 'BLOCKING' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedComponent: string;
  regulatoryClause: string;
  rootCause: string;
  recommendedFix: string;
  assignedOwnerRole: string;
  status: 'OPEN_BLOCKER' | 'REMEDIATION_IN_PROGRESS' | 'RESOLVED';
}

export interface ComplianceTraceabilityItem {
  findingId: string;
  title: string;
  prdSafeguardOrNfr: string; // e.g. Safeguard-3 / NFR-SEC-01
  regulatoryFramework: string; // e.g. FERPA / COPPA / GDPR Art. 8
  verificationMethod: string;
}

export interface ComplianceRiskItem {
  riskId: string;
  riskTitle: string;
  threatDescription: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  mitigationStrategy: string;
  residualRisk: string;
  ownerRole: string;
}

export interface ComplianceHumanChecklistItem {
  id: string;
  roleTitle: string; // e.g. Legal & Privacy Officer
  verificationRequirement: string;
  evidenceVerified: string;
  signoffStatus: 'APPROVED' | 'PENDING_REMEDIATION' | 'REJECTED';
}

// ==========================================
// STAKEHOLDER DEMO SCRIPT & PILOT READINESS TYPES
// ==========================================

export interface DemoScriptStep {
  stepNumber: number;
  stepId: string;
  title: string;
  durationSeconds: number;
  presenterRole: 'PRODUCT_MANAGER' | 'LEAD_ENGINEER' | 'PILOT_OPERATIONS';
  narrationScript: string;
  expectedSystemBehavior: string;
  safeguardDemonstrated: string; // e.g. Socratic Refusal, Teacher Override
  safeguardType: 'SOCRATIC_SAFETY' | 'TEACHER_CONTROL' | 'AUDIT_INTEGRITY' | 'AI_DISCLOSURE' | 'OFFLINE_RESILIENCE';
  fallbackTalkingPoint: string; // For live latency/network failure recovery
  claimType: 'VERIFIED_IN_BUILD' | 'PROJECTED_PILOT_TARGET';
}

export interface PilotReadinessChecklistItem {
  itemId: string;
  category: 'TECHNICAL' | 'PEDAGOGICAL' | 'COMPLIANCE' | 'TEACHER_TRAINING';
  requirementTitle: string;
  description: string;
  namedOwner: string;
  status: 'READY' | 'NOT_READY' | 'IN_REMEDIATION';
  verificationEvidence: string;
}

export interface DemoTraceabilityItem {
  stepId: string;
  stepTitle: string;
  prdUserJourney: string; // e.g., Journey 2: Teacher Override
  safeguardOrMetricDemonstrated: string;
  systemCapabilityVerified: string;
}

export interface DemoRiskItem {
  riskId: string;
  riskTitle: string;
  failureScenario: string;
  impactOnDemo: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  liveMitigationScript: string;
  technicalFallbackAction: string;
  ownerRole: string;
}

export interface DemoHumanChecklistItem {
  id: string;
  roleTitle: string; // e.g. Lead Engineer, Security Reviewer
  reviewFocusArea: string;
  verificationEvidence: string;
  signoffStatus: 'APPROVED' | 'PENDING_REMEDIATION' | 'REJECTED';
}






