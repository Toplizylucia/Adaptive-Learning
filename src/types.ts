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


