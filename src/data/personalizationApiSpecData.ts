import { ApiEndpointSpec, ApiErrorCode, HumanReviewChecklistItem, TraceabilityRow, SystemRiskItem } from '../types';

export const PERSONALIZATION_API_SUMMARY = {
  title: 'Personalization Engine API Specification Contract v1.0',
  serviceName: 'personalization-engine-service',
  version: '1.0.0-GA',
  protocol: 'RESTful JSON / HTTPS (TLS 1.3)',
  authModel: 'OAuth2 / OIDC JWT Bearer Tokens with Scoped Role-Based Access Control (RBAC)',
  overview: `The Personalization Engine is the central microservice responsible for real-time diagnostic evaluation, Bayesian Knowledge Tracing (BKT) vector updates, misconception classification, and grounded AI explanation synthesis. 

It exposes dual public/internal contracts tailored for high-concurrency learner clients (<5,000 active classroom sessions) and teacher/district analytics dashboards. All endpoints enforcing state updates log an immutable adaptive decision 'reason', and all instructional content outputs mandate a verified 'source_citation' to eliminate ungrounded AI hallucinations.`
};

export const API_ASSUMPTIONS_AND_QUESTIONS = [
  {
    category: 'API Style & Transport',
    assumption: 'RESTful JSON over HTTPS (TLS 1.3) with HTTP/2 multiplexing.',
    justification: 'Enables high client compatibility across mobile apps, Chromebook PWAs, and server-to-server dashboard streaming.'
  },
  {
    category: 'Authentication & Authorization',
    assumption: 'OAuth2 / OpenID Connect (OIDC) JWT tokens issued by institutional IdPs (ClassLink, Clever, Google Workspace).',
    justification: 'Guarantees role-based claims (ROLE_LEARNER, ROLE_TEACHER, ROLE_ADMIN) with automatic tenant isolation by school_id.'
  },
  {
    category: 'Cost Tier & Rate Limiting',
    assumption: 'Tier 1 Micro-Rule scoring ($0 cost, 15ms SLA) handles 85% of responses. Tier 2 Gemini 3.6 Flash ($0.0001/call) is invoked strictly for custom misconception remediation.',
    justification: 'Maintains daily LLM expenditure within the strict $0.005 / student / day budget ceiling ($25.00/day across 5,000 learners).'
  },
  {
    category: 'Strict Grounding Constraint',
    assumption: 'No LLM-generated feedback may be served to a learner without a validated curriculum source_citation matching approved textbook objectives.',
    justification: 'Prevents educational hallucination and satisfies state curriculum compliance audits.'
  },
  {
    category: 'Open Question 1',
    assumption: 'Idempotency Key Retention Window',
    justification: 'Should Redis store client Idempotency-Keys for 24 hours or 72 hours to accommodate long weekend offline syncs?'
  },
  {
    category: 'Open Question 2',
    assumption: 'GraphQL vs REST Event Subscriptions',
    justification: 'While REST endpoints handle direct student submissions, should real-time teacher dashboard alerts migrate to Server-Sent Events (SSE) or WebSockets in v1.1?'
  }
];

export const PERSONALIZATION_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'ep_diagnose',
    method: 'POST',
    path: '/api/v1/personalization/diagnose',
    purpose: 'Evaluates learner practice question submissions, calculates atomic BKT mastery delta p(L_k), detects misconception codes, and updates the learner profile.',
    authLevelRequired: 'ROLE_LEARNER',
    costTier: 'TIER_1_MICRO_RULE',
    idempotencySupported: true,
    rateLimitHeader: 'X-RateLimit-Limit: 120/min per learner_id',
    sourceCitationRequired: true,
    reasonRequired: true,
    frMappings: ['FR-1', 'FR-2', 'FR-5', 'FR-6', 'FR-8', 'FR-13'],
    requestSchemaJson: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "learner_id",
    "curriculum_node_id",
    "question_id",
    "selected_choice_id"
  ],
  "properties": {
    "learner_id": { "type": "string", "example": "lrn_784910" },
    "curriculum_node_id": { "type": "string", "example": "MATH_7_RATIOS_101" },
    "question_id": { "type": "string", "example": "q_ratio_1" },
    "selected_choice_id": { "type": "string", "example": "choice_b" },
    "time_spent_seconds": { "type": "integer", "minimum": 1, "example": 24 },
    "client_timestamp": { "type": "string", "format": "date-time", "example": "2026-07-24T11:45:00Z" }
  }
}`,
    responseSchemaJson: `{
  "status": "success",
  "data": {
    "event_id": "evt_diag_984120",
    "learner_hash": "ANON_LRN_701",
    "is_correct": false,
    "detected_misconception": {
      "tag": "MIS_RATIO_ADDITIVE_ERROR",
      "description": "Student added quantities directly instead of computing multiplicative ratio relationship."
    },
    "bkt_mastery_delta": {
      "skill_id": "MATH_7_RATIOS_101",
      "previous_p_mastery": 0.42,
      "updated_p_mastery": 0.35,
      "bkt_parameters_used": { "slip_p": 0.10, "guess_p": 0.20, "transit_p": 0.15 }
    },
    "reason": "BKT mastery probability dropped from 0.42 to 0.35 due to incorrect response carrying misconception MIS_RATIO_ADDITIVE_ERROR. Triggered targeted scaffolded explanation.",
    "source_citation": {
      "curriculum_node_id": "MATH_7_RATIOS_101",
      "learning_objective": "CCSS.MATH.CONTENT.7.RP.A.2: Recognize and represent proportional relationships.",
      "textbook_reference": "Grade 7 Illustrative Mathematics, Unit 2, Lesson 4",
      "verified_grounded": true
    },
    "model_routing": {
      "tier": "TIER_1_MICRO_RULE",
      "latency_ms": 18,
      "cost_usd": 0.000000
    }
  }
}`,
    edgeCases: [
      {
        caseName: 'Empty/Missing Answer Choice',
        description: 'Client submits request without selected_choice_id or null payload.',
        expectedStatusCode: 400,
        errorResponseJson: `{\n  "error": {\n    "code": "ERR_INVALID_PAYLOAD",\n    "message": "Required field 'selected_choice_id' is missing from practice submission payload.",\n    "retry_guidance": "Provide a valid choice ID from the current question's choice rubric."\n  }\n}`
      },
      {
        caseName: 'Duplicate Submission (Idempotency Replay)',
        description: 'Client re-transmits answer with previously processed Idempotency-Key header.',
        expectedStatusCode: 200,
        errorResponseJson: `/* Returns cached original response payload instantly without re-applying BKT delta */`
      },
      {
        caseName: 'Non-Existent Curriculum Node ID',
        description: 'Question payload references a node missing from Content Store.',
        expectedStatusCode: 422,
        errorResponseJson: `{\n  "error": {\n    "code": "ERR_MISSING_CURRICULUM_SOURCE",\n    "message": "Curriculum node 'MATH_9_UNKNOWN' does not exist in standard taxonomy.",\n    "retry_guidance": "Verify curriculum taxonomy mapping or fallback to prerequisite root node."\n  }\n}`
      }
    ]
  },
  {
    id: 'ep_explain',
    method: 'POST',
    path: '/api/v1/personalization/explain',
    purpose: 'Invokes Gemini 3.6 Flash (or warm Redis cache) to synthesize a personalized, scaffolded explanation tailored to student reading level and detected misconception.',
    authLevelRequired: 'ROLE_LEARNER',
    costTier: 'TIER_2_GEMINI_FLASH',
    idempotencySupported: false,
    rateLimitHeader: 'X-RateLimit-Limit: 30/min per learner_id (Cost Protected)',
    sourceCitationRequired: true,
    reasonRequired: true,
    frMappings: ['FR-3', 'FR-4', 'FR-8', 'FR-10', 'FR-12', 'FR-13', 'FR-14'],
    requestSchemaJson: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "learner_id",
    "curriculum_node_id",
    "misconception_tag"
  ],
  "properties": {
    "learner_id": { "type": "string" },
    "curriculum_node_id": { "type": "string" },
    "misconception_tag": { "type": "string" },
    "accessibility_override": {
      "type": "object",
      "properties": {
        "reading_level": { "type": "string", "enum": ["foundational", "standard", "advanced"] },
        "step_chunk_size": { "type": "integer", "maximum": 3 }
      }
    }
  }
}`,
    responseSchemaJson: `{
  "status": "success",
  "data": {
    "explanation_id": "exp_gemini_77102",
    "learner_hash": "ANON_LRN_701",
    "generated_text": "Notice how flour and sugar increase together! If 2 cups of flour need 3 cups of sugar, then 4 cups of flour need double the sugar—6 cups, not 5. You multiply both quantities by 2 instead of adding 1.",
    "reading_level_applied": "foundational",
    "reason": "Synthesized targeted 2-sentence scaffold addressing MIS_RATIO_ADDITIVE_ERROR while adhering to foundational reading level constraints.",
    "source_citation": {
      "curriculum_node_id": "MATH_7_RATIOS_101",
      "learning_objective": "CCSS.MATH.CONTENT.7.RP.A.2a: Decide whether two quantities are in a proportional relationship.",
      "textbook_reference": "Grade 7 Illustrative Mathematics, Unit 2, Section B",
      "verified_grounded": true
    },
    "model_routing": {
      "tier": "TIER_2_GEMINI_FLASH",
      "model_name": "gemini-3.6-flash-server-proxy",
      "latency_ms": 380,
      "cost_usd": 0.000095,
      "cache_hit": false
    }
  }
}`,
    edgeCases: [
      {
        caseName: 'Rate Limit / Daily Budget Cap Reached',
        description: 'School daily LLM spending reaches 100% of $25.00 budget ceiling.',
        expectedStatusCode: 429,
        errorResponseJson: `{\n  "error": {\n    "code": "ERR_BUDGET_CAP_EXCEEDED",\n    "message": "Daily district LLM spending cap ($25.00) reached. System automatically switched to warm static cache.",\n    "retry_guidance": "Static pre-computed explanations served automatically until midnight UTC reset."\n  }\n}`
      },
      {
        caseName: 'LLM Response Latency Timeout (>1,200ms)',
        description: 'Gemini endpoint response takes over 1.2s; circuit breaker triggers.',
        expectedStatusCode: 200,
        errorResponseJson: `/* Serves pre-cached fallback explanation template with banner: "Serving instant static scaffold." */`
      }
    ]
  },
  {
    id: 'ep_recommend',
    method: 'POST',
    path: '/api/v1/personalization/recommend',
    purpose: 'Queries the curriculum taxonomy tree to select the next optimal learning node or practice item matching student BKT mastery status.',
    authLevelRequired: 'ROLE_LEARNER',
    costTier: 'TIER_1_MICRO_RULE',
    idempotencySupported: false,
    rateLimitHeader: 'X-RateLimit-Limit: 60/min per learner_id',
    sourceCitationRequired: true,
    reasonRequired: true,
    frMappings: ['FR-5', 'FR-15'],
    requestSchemaJson: `{
  "learner_id": "lrn_784910",
  "current_node_id": "MATH_7_RATIOS_101",
  "requested_difficulty_bias": "ZPD_OPTIMAL"
}`,
    responseSchemaJson: `{
  "status": "success",
  "data": {
    "recommended_node_id": "MATH_7_RATIOS_101",
    "recommended_action": "PRACTICE_SCAFFOLDED_ITEM",
    "recommended_item_id": "q_ratio_2_scaffolded",
    "target_difficulty": 0.35,
    "reason": "Learner BKT mastery (0.35) is below advancement threshold (0.80). Recommended lower-difficulty scaffolded practice item on current node.",
    "source_citation": {
      "curriculum_node_id": "MATH_7_RATIOS_101",
      "learning_objective": "CCSS.MATH.CONTENT.7.RP.A.2: Proportional relationships practice.",
      "verified_grounded": true
    }
  }
}`,
    edgeCases: [
      {
        caseName: 'Curriculum Tree Gap / Prerequisite Fallback',
        description: 'Learner mastery fails on advanced node with no remaining practice items.',
        expectedStatusCode: 200,
        errorResponseJson: `/* Automatically returns prerequisite parent node 'MATH_6_RATIOS_INTRO' with reason logged */`
      }
    ]
  },
  {
    id: 'ep_mastery',
    method: 'GET',
    path: '/api/v1/personalization/mastery/{learner_id}',
    purpose: 'Retrieves current BKT mastery vectors, misconception history, and accessibility preferences with strict Role-Based PII sanitization.',
    authLevelRequired: 'ROLE_LEARNER',
    costTier: 'TIER_0_CACHE_LOOKUP',
    idempotencySupported: false,
    rateLimitHeader: 'X-RateLimit-Limit: 300/min',
    sourceCitationRequired: false,
    reasonRequired: false,
    frMappings: ['FR-6', 'FR-8', 'FR-16'],
    requestSchemaJson: `/* HTTP GET Request / Path Parameter: learner_id */`,
    responseSchemaJson: `{
  "status": "success",
  "caller_role": "ROLE_TEACHER",
  "pii_scoping": "TEACHER_ROSTER_VIEW",
  "data": {
    "learner_id": "lrn_784910",
    "display_name": "Alex Chen",
    "anonymized_hash": "ANON_LRN_701",
    "school_id": "sch_oakridge_402",
    "mastery_vector": {
      "MATH_7_RATIOS_101": {
        "skill_name": "Proportional Relationships",
        "mastery_probability": 0.35,
        "attempts_count": 4,
        "status": "NEEDS_INTERVENTION"
      }
    },
    "misconception_history": [
      {
        "tag": "MIS_RATIO_ADDITIVE_ERROR",
        "frequency": 3,
        "resolved": false
      }
    ]
  }
}`,
    edgeCases: [
      {
        caseName: 'Unauthorized Student Cross-Tenant Data Access',
        description: 'Student A requests Student B learner profile data.',
        expectedStatusCode: 403,
        errorResponseJson: `{\n  "error": {\n    "code": "ERR_FORBIDDEN_PII_EXPOSURE",\n    "message": "Role 'ROLE_LEARNER' is forbidden from viewing profile of another student.",\n    "retry_guidance": "Call endpoint with authenticated caller's own learner_id."\n  }\n}`
      }
    ]
  },
  {
    id: 'ep_sync',
    method: 'POST',
    path: '/api/v1/personalization/sync',
    purpose: 'Flushes queued offline diagnostic answer events from client IndexedDB with Optimistic Concurrency Control (OCC) version stamps.',
    authLevelRequired: 'ROLE_LEARNER',
    costTier: 'TIER_1_MICRO_RULE',
    idempotencySupported: true,
    rateLimitHeader: 'X-RateLimit-Limit: 30/min per client',
    sourceCitationRequired: true,
    reasonRequired: true,
    frMappings: ['FR-7', 'FR-11', 'FR-17'],
    requestSchemaJson: `{
  "learner_id": "lrn_784910",
  "client_occ_version": 14,
  "queue_items": [
    {
      "event_id": "evt_offline_172001",
      "timestamp": "2026-07-24T11:20:00Z",
      "curriculum_node_id": "MATH_7_RATIOS_101",
      "selected_choice_id": "choice_b"
    }
  ]
}`,
    responseSchemaJson: `{
  "status": "success",
  "processed_count": 1,
  "new_occ_version": 15,
  "reason": "Batch synchronized 1 offline diagnostic event. Resolved state deltas with Optimistic Concurrency Control.",
  "source_citation": {
    "curriculum_node_id": "MATH_7_RATIOS_101",
    "verified_grounded": true
  }
}`,
    edgeCases: [
      {
        caseName: 'OCC State Version Conflict',
        description: 'Client sync version is stale compared to server master version.',
        expectedStatusCode: 409,
        errorResponseJson: `{\n  "error": {\n    "code": "ERR_OCC_VERSION_CONFLICT",\n    "message": "Client state version (12) is behind server master version (15). Re-syncing master state delta.",\n    "retry_guidance": "Fetch latest profile state via /mastery before re-submitting queue."\n  }\n}`
      }
    ]
  }
];

export const PERSONALIZATION_ERROR_CODES: ApiErrorCode[] = [
  {
    code: 'ERR_UNAUTHORIZED',
    httpStatus: 401,
    meaning: 'OAuth2 JWT token is missing, expired, or failed signature verification.',
    clientFacingMessage: 'Session expired. Please log in again via your school portal.',
    retryGuidance: 'Re-authenticate with institutional IdP and pass valid Authorization: Bearer <token>.'
  },
  {
    code: 'ERR_FORBIDDEN_PII_EXPOSURE',
    httpStatus: 403,
    meaning: 'Caller role lacks permission to access requested learner profile or PII level.',
    clientFacingMessage: 'Access denied: You do not have permission to view this student data.',
    retryGuidance: 'Ensure caller JWT carries ROLE_TEACHER or ROLE_ADMIN scoped to target school_id.'
  },
  {
    code: 'ERR_INVALID_IDEMPOTENCY_KEY',
    httpStatus: 400,
    meaning: 'Idempotency-Key header is malformed or missing on state-changing endpoint.',
    clientFacingMessage: 'Submission payload invalid. Request header missing transaction UUID.',
    retryGuidance: 'Include a unique UUIDv4 string in the Idempotency-Key HTTP request header.'
  },
  {
    code: 'ERR_MISSING_CURRICULUM_SOURCE',
    httpStatus: 422,
    meaning: 'Requested curriculum node ID or prerequisite anchor is not found in Content Store.',
    clientFacingMessage: 'Curriculum objective unavailable. Returning to standard topic index.',
    retryGuidance: 'Verify node taxonomy ID against Content Store API or fallback to root node.'
  },
  {
    code: 'ERR_BUDGET_CAP_EXCEEDED',
    httpStatus: 429,
    meaning: 'Daily district LLM token expenditure limit ($25.00/day) reached.',
    clientFacingMessage: 'Daily AI generation quota reached for your school. Using instant offline response library.',
    retryGuidance: 'System automatically falls back to warm Redis static micro-rule explanations.'
  },
  {
    code: 'ERR_LLM_TIMEOUT_FALLBACK',
    httpStatus: 504,
    meaning: 'Third-party Gemini Flash response latency exceeded 1,200ms circuit breaker timeout.',
    clientFacingMessage: 'Connection slow. Serving instant pre-computed explanation scaffold.',
    retryGuidance: 'No action required. Response automatically fulfilled by warm Redis cache.'
  },
  {
    code: 'ERR_OCC_VERSION_CONFLICT',
    httpStatus: 409,
    meaning: 'Client offline sync state version conflicts with current server master state version.',
    clientFacingMessage: 'Syncing latest learning progress from classroom cloud...',
    retryGuidance: 'Fetch server master vector via GET /mastery/{learner_id} and re-apply local queue.'
  }
];

export const SECURITY_RISK_ANALYSIS: SystemRiskItem[] = [
  {
    id: 'sec_risk_1',
    category: 'PII_LEAK',
    riskDescription: 'Data Exposure via API Endpoint: Endpoint returns full student name to third-party LLM or unauthorized teacher dashboard.',
    impactLevel: 'CRITICAL',
    likelihood: 'LOW',
    mitigationStrategy: 'API Gateway Sanitizer interceptor enforces JSON masking filter. Replaces displayName with anonymized hash (ANON_LRN_XXX) before any payload reaches LLM endpoints.',
    componentOwner: 'API Gateway Sanitizer',
    frMapping: 'FR-8, FR-11'
  },
  {
    id: 'sec_risk_2',
    category: 'CONTENT_GAP',
    riskDescription: 'Ungrounded Content Exposure: LLM generates mathematically incorrect or uncurriculum-aligned explanation.',
    impactLevel: 'HIGH',
    likelihood: 'LOW',
    mitigationStrategy: 'System prompt enforces strict retrieval grounding. Response validator mandates presence of verified source_citation before returning 200 OK.',
    componentOwner: 'Personalization Engine',
    frMapping: 'FR-4'
  },
  {
    id: 'sec_risk_3',
    category: 'LLM_COST',
    riskDescription: 'Cost Overflow Attack: Malicious client loops /explain endpoint to drain district LLM budget.',
    impactLevel: 'HIGH',
    likelihood: 'MEDIUM',
    mitigationStrategy: 'Cost-aware Token Bucket rate limiter (30 req/min per learner). Hard daily ceiling cap ($25.00/day across district) forces Tier 1 static cache fallback.',
    componentOwner: 'Gateway Rate Limiter',
    frMapping: 'FR-3, FR-10'
  },
  {
    id: 'sec_risk_4',
    category: 'DATA_SYNC',
    riskDescription: 'State Desynchronization during Multi-Device / Offline Sync.',
    impactLevel: 'MEDIUM',
    likelihood: 'MEDIUM',
    mitigationStrategy: 'Optimistic Concurrency Control (OCC) with integer version stamps on all BKT mastery vectors.',
    componentOwner: 'Learner Profile Store',
    frMapping: 'FR-7, FR-17'
  }
];

export const HUMAN_REVIEW_CHECKLIST: HumanReviewChecklistItem[] = [
  {
    id: 'chk_1',
    category: 'DATA_EXPOSURE',
    checkItem: 'Verified zero student PII (names, emails, phone numbers) exposed to external Gemini LLM endpoints.',
    verified: true,
    notes: 'Gateway Sanitizer transforms all student identifiers to ANON_LRN_XXX hashes before LLM dispatch.'
  },
  {
    id: 'chk_2',
    category: 'GROUNDING_CITATIONS',
    checkItem: 'Verified every response payload containing instructional content includes a valid source_citation field.',
    verified: true,
    notes: 'All /diagnose, /explain, and /recommend endpoints return verified curriculum_node_id and learning_objective anchors.'
  },
  {
    id: 'chk_3',
    category: 'ADAPTIVE_LOGGING',
    checkItem: 'Verified every endpoint updating learner state logs an explicit reason field explaining the adaptive decision.',
    verified: true,
    notes: 'Logged in append-only audit stream and returned in response payload (traceable to FR-13).'
  },
  {
    id: 'chk_4',
    category: 'IDEMPOTENCY',
    checkItem: 'Verified state-changing endpoints (/diagnose and /sync) enforce Idempotency-Key handling to prevent duplicate BKT updates.',
    verified: true,
    notes: 'Redis caches transaction keys with 24-hour TTL.'
  },
  {
    id: 'chk_5',
    category: 'COST_CONTROL',
    checkItem: 'Verified generation-heavy endpoints (/explain) specify cost tier and enforce $25.00/day district budget cap.',
    verified: true,
    notes: '85% cache hit efficiency maintains expenditure well below $0.005 / student / day.'
  }
];
