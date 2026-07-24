import { ArchitectureSection, SystemRiskItem, TraceabilityRow } from '../types';

export const ARCHITECTURE_SECTIONS: ArchitectureSection[] = [
  {
    id: 'sec_summary',
    title: '1. Executive Summary & FR Mappings',
    frNumber: 'FR-1 to FR-20',
    summary: 'Comprehensive system architecture mapping for the Adaptive Learning Copilot deployed across 40 schools and 5,000 concurrent learners.',
    contentMarkdown: `### Executive Architectural Overview

The **Adaptive Learning Copilot** is a high-concurrency, offline-resilient AI platform designed to deliver personalized diagnostic feedback, curriculum-grounded explanations, and real-time mastery tracking across diverse classroom environments.

The system is constructed with a decoupled, event-driven microservices architecture prioritizing:
1. **Cost-Aware Tiered Model Routing**: Low-cost micro-rule scoring engines handle routine feedback ($0 cost, 15ms latency), while strong LLMs (**Gemini 3.6 Flash**) generate personalized scaffolded explanations only when misconceptions are detected.
2. **Strict Privacy & De-PII Boundary**: Zero learner PII is exposed to LLM endpoints. Learner identities are anonymized at the API Gateway using cryptographic hashes ("ANON_LRN_701").
3. **Offline-First Resiliency**: Local storage caches last-known curriculum units and queues diagnostic events during network drops, guaranteeing uninterrupted classroom learning.
4. **Real-time Bayesian Knowledge Tracing (BKT)**: Mastery vectors update atomically on every response submission, immediately reflecting in teacher dashboards and adaptive path recommendations.

#### Functional Requirements Mapping Matrix (FR-1 to FR-20)
* **FR-1 (Real-time Diagnostic Scoring)**: Handled by Diagnostic Engine using Bayesian Knowledge Tracing (BKT).
* **FR-2 (Misconception Detection)**: Handled by Rule Classifier & Gemini Diagnostic Prompts using predefined misconception rubrics.
* **FR-3 (Tiered Model Routing)**: Managed by Personalization Engine (Tier 1 Rule Engine vs Tier 2 Gemini Flash).
* **FR-4 (Curriculum-Grounded Explanation)**: Managed by Content Store & Personalization Engine using retrieval-augmented prompt templates.
* **FR-5 (Adaptive Scaffolded Practice)**: Handled by Diagnostic Engine calculating item difficulty relative to learner p(L_k).
* **FR-6 (Learner Profile Synchronization)**: Persistent Learner Profile Store with atomic transaction locks.
* **FR-7 (Offline Data Queueing)**: Client Service Worker + IndexedDB queue with exponential backoff resync.
* **FR-8 (Zero-PII Sanitization)**: API Gateway Sanitizer regex + NER scrubbing before third-party LLM dispatch.
* **FR-9 (Teacher Dashboard Backend)**: Event Streaming Pipeline (Kafka/PubSub) feeding real-time alert aggregators.
* **FR-10 (LLM Budget Cap Enforcement)**: Cost-aware Rate Limiter & Token Bucket ($0.005/student/day limit).
* **FR-11 (Immutable Audit Logging)**: Cryptographic hash-chained append-only event ledger.
* **FR-12 (Accessibility Customization)**: Profile-driven prompt modifiers (reading level, text-to-speech scaffolding).
* **FR-13 (Cache Layer Optimization)**: Redis response cache achieving 85%+ hit rate on common misconception explanations.
* **FR-14 (Graceful LLM Timeout Handling)**: Fallback to pre-cached rule templates if LLM latency exceeds 1,200ms.
* **FR-15 (Curriculum Gap Handling)**: Fallback to foundational prerequisite node when target content node is absent.
* **FR-16 (Role-Based Access Control)**: Auth Gateway enforcing RBAC boundaries for Learners, Teachers, and District Admins.
* **FR-17 (Optimistic Concurrency Control)**: Version-stamped state deltas preventing state overwrites during multi-device sync.
* **FR-18 (Teacher Alert Generation)**: Automated flag trigger when a student hits >3 consecutive misconceptions.
* **FR-19 (District Aggregate Analytics)**: Anonymized batch rollups of school-wide mastery trends.
* **FR-20 (System Self-Healing & Circuit Breaking)**: Automatic fallback circuit breaker on external API error rates >5%.`
  },
  {
    id: 'sec_assumptions',
    title: '2. Assumptions & Open Questions',
    frNumber: 'FR-3, FR-10, FR-13',
    summary: 'Deployment benchmarks, scale calculations, LLM cost constraints, and connectivity SLA targets.',
    contentMarkdown: `### Baseline Operational Assumptions & Benchmarks

| Metric / Constraint | Target Value / Assumption | Justification & Benchmark Source |
| :--- | :--- | :--- |
| **Active Concurrency** | 5,000 learners peak across 40 schools | Standard peak hour requirement (9:00 AM - 11:30 AM local time). |
| **Daily Session Volume** | 35,000 total learning sessions / day | ~7 sessions per active student per school day. |
| **Max Latency SLA** | Scoring: <50ms \| Generation: <800ms | SLA for classroom engagement without disrupting lesson flow. |
| **LLM Budget Cap** | **$0.005 / student / session day** ($25.00/day total) | Managed via **Gemini 3.6 Flash** ($0.10/1M input tokens, $0.40/1M output tokens). |
| **Cache Hit Ratio** | 85% for common misconception explanations | Pre-computed & warm-cached explanation rubrics for top 50 misconceptions per topic. |
| **Network Profile** | 25% low-bandwidth / variable 2G/3G connectivity | Rural/suburban school infrastructure conditions; requires offline queue. |
| **Data Retention** | Session Logs: 90 days \| Mastery Vectors: 7 years | Compliance with state educational records retention policies. |

#### Stated LLM Cost Calculation Benchmark
* **Tier 1 (Scoring & Rules)**: 100% handled locally on microservices ($0 LLM cost).
* **Tier 2 (Gemini 3.6 Flash for Custom Generation)**:
  * Avg prompt tokens: 400 tokens; Avg completion tokens: 150 tokens.
  * Cost per call: (400 * 0.0000001) + (150 * 0.0000004) = $0.00010.
  * With 85% cache hit rate, only 15% of feedback triggers a fresh LLM call.
  * 10 practice items per student/day * 15% cache miss = 1.5 LLM calls/student/day.
  * **Daily Cost per Student**: 1.5 * $0.00010 = **$0.00015 / student / day** (Well below the $0.005 cap!).

#### Open Architectural Questions
1. *LMS Integration Standard*: Should student SSO follow LTI v1.3 Advantage or OAuth2 / OIDC SAML federations across all 40 districts?
2. *Local Storage Quota Limits*: On low-end Chromebooks/tablets, should client-side IndexedDB cache be capped at 50 MB with LRU eviction?`
  },
  {
    id: 'sec_architecture',
    title: '3. Technical Component Architecture',
    frNumber: 'FR-1 to FR-16',
    summary: 'System boundaries, component responsibilities, and connection patterns.',
    contentMarkdown: `### System Component Boundaries & Ownership

The Adaptive Learning Copilot architecture consists of 6 primary sub-systems:

#### 1. Learner Edge Client & Progressive Offline Worker
* **Ownership**: Client Runtime (PWA / Mobile / Browser).
* **Responsibilities**: Renders practice interface, captures learner actions, maintains client-side IndexedDB offline queue, performs local encryption of cached content.
* **Failure Mode**: If network fails, queues requests with local timestamp and optimistic UI updates.

#### 2. API Gateway, Rate Limiter & PII Sanitizer
* **Ownership**: Edge Infrastructure / Ingress.
* **Responsibilities**: Enforces TLS 1.3, authenticates JWT sessions, applies token-bucket rate limits per school, scrubs name/email/school PII using Regex & NER models before forwarding to backend microservices.

#### 3. Diagnostic Engine
* **Ownership**: Core Analytics Service.
* **Responsibilities**: Runs Bayesian Knowledge Tracing (BKT) equations to update mastery probability p(L_k), matches response against misconception rubrics, determines optimal item difficulty d_i.

#### 4. Personalization Engine & Model Router
* **Ownership**: AI Orchestration Service.
* **Responsibilities**: Receives diagnostic context, evaluates prompt cache in Redis. On cache miss, selects appropriate LLM tier (Tier 1 micro-rules vs Tier 2 Gemini Flash), constructs system prompt with accessibility constraints, handles timeouts (1,200ms threshold).

#### 5. Data Stores
* **Learner Profile Store**: Redis (volatile session state) + PostgreSQL/Firestore (durable BKT mastery vectors & misconception history).
* **Curriculum & Content Store**: PostgreSQL (relational standards taxonomy) + Vector DB (semantic embedding lookup for prerequisite remediation).
* **Immutable Audit Ledger**: Append-only PostgreSQL / BigQuery table with cryptographic SHA-256 hash chaining for security compliance.

#### 6. Teacher & District Admin Dashboard Backend
* **Ownership**: Analytics & Monitoring.
* **Responsibilities**: Real-time WebSocket event listener processing student updates, generating alerts when misconception thresholds are exceeded, rendering budget consumption meters.`
  },
  {
    id: 'sec_dataflow',
    title: '4. Data Flow Description (Request Lifecycle)',
    frNumber: 'FR-1, FR-3, FR-4, FR-6, FR-8',
    summary: 'End-to-end trace of a learner submitting an answer through diagnosis, AI generation, and profile update.',
    contentMarkdown: `### Step-by-Step Request Lifecycle Sequence

[ Learner Action ]
        │
        ▼
[ Edge Client / PWA ] ──── (Offline?) ────► [ IndexedDB Queue ]
        │                                         │ (On Reconnect)
        ▼ (HTTPS / TLS 1.3)                       ▼
[ API Gateway & PII Sanitizer ] ──► (Scrub Names/Emails to ANON_LRN_701)
        │
        ▼
[ Diagnostic Engine ] ──► (Calculate BKT Delta: p(L_k) 0.42 -> 0.35)
        │
        ▼
[ Personalization Engine ] ──► Check Redis Cache? ──► [ CACHE HIT: 15ms ]
        │ (CACHE MISS)                                       │
        ▼                                                    │
[ Tiered Model Router ]                                      │
        │                                                    │
        ├──────► [ Tier 1 Micro-Rules ] ($0, 20ms)           │
        │                                                    │
        └──────► [ Tier 2 Gemini Flash ] ($0.0001, 400ms) ───┤
                                                             │
                                                             ▼
[ Learner Profile Delta Update ] ◄───────────────────────────┘
        │
        ├──────► [ Client Response Payload ]
        └──────► [ Immutable Audit Log & Teacher WebSocket ]

#### Lifecycle Breakdown:
1. **Trigger**: Learner submits choice B for ratio question Q_RATIO_1 ("5 cups of flour").
2. **PII Scrubbing**: Gateway replaces student name "Alex Chen" with anonymized hash "ANON_LRN_701".
3. **Diagnostic Analysis**: Diagnostic Engine matches choice B to misconception tag "MIS_RATIO_ADDITIVE_ERROR".
4. **BKT Update**: Recalculates mastery for "MATH_7_RATIOS_101" from 0.42 down to 0.35 based on slip/guess parameters (P_S=0.1, P_G=0.2).
5. **Model Routing**: Personalization Engine constructs prompt. Checks Redis cache.
6. **Gemini Generation**: On cache miss, calls **Gemini 3.6 Flash** server-side with system instruction: "Act as an encouraging Grade 7 math copilot. Provide a 2-sentence scaffolded explanation without giving away the final answer."
7. **Profile Delta**: Learner Profile Store performs atomic UPDATE on misconception_history and mastery_vector.
8. **Real-time Event Broadcast**: Event emitted to Teacher Dashboard showing student needs assistance.`
  },
  {
    id: 'sec_schemas',
    title: '5. Data Model & JSON Schema Definitions',
    frNumber: 'FR-6, FR-4, FR-11',
    summary: 'Strict JSON schemas for Learner Profiles, Curriculum Content, and Diagnostic Event Session Logs.',
    contentMarkdown: `### Formal JSON Schema Specifications

See the dedicated **JSON Schemas** tab in the main navigation for fully interactive schema validation and code inspection for:
1. **Learner Profile Model** (bkt_mastery_vector, misconception_history, accessibility_prefs)
2. **Curriculum Content Store Model** (learning_objective_id, prerequisite_nodes, difficulty_index, misconception_rubric)
3. **Diagnostic Session Audit Log Model** (event_id, sanitized_prompt_hash, model_tier_used, latency_ms, cost_usd, audit_hash)`
  },
  {
    id: 'sec_traceability',
    title: '6. PRD Traceability & Component Matrix',
    frNumber: 'FR-1 to FR-20',
    summary: 'Verification matrix mapping every functional requirement to system components, security controls, and test status.',
    contentMarkdown: `### PRD Requirement Traceability Overview

See the dedicated **Traceability Matrix** tab in the top navigation to search, filter, and inspect the complete mapping of FR-1 through FR-20 to system microservices, security controls, and automated verification status.`
  },
  {
    id: 'sec_risks',
    title: '7. System Risks & Mitigation Strategies',
    frNumber: 'All FRs',
    summary: 'Failure modes, contingency mechanisms, and operational safeguards.',
    contentMarkdown: `### Key System Failure Modes & Mitigations

#### Risk 1: LLM Latency Spike or Endpoint Timeout
* **Description**: Third-party LLM API latency exceeds 1,200ms during peak classroom hours.
* **Impact**: Classroom disruption and learner hesitation.
* **Mitigation**: Strict 1,200ms timeout circuit breaker. Instantly falls back to pre-authored static explanation scaffold stored in Redis content cache.

#### Risk 2: Connectivity Loss Mid-Session
* **Description**: Rural school Wi-Fi drops while student is answering a multi-step problem.
* **Impact**: Loss of diagnostic progress or broken state synchronization.
* **Mitigation**: Client Service Worker traps failed requests, stores signed state delta in IndexedDB, and displays "Offline Mode Active" badge. Flushes queue automatically upon network restoration using exponential backoff.

#### Risk 3: LLM Cost Budget Exceeded
* **Description**: Unforeseen spike in open-ended student queries exhausts $0.005/student/day budget cap.
* **Impact**: Financial overflow or unexpected service suspension.
* **Mitigation**: API Gateway tracks cumulative token cost per school ID in Redis. When school reaches 90% budget cap, system automatically restricts queries to Tier 1 micro-rules and warm-cached responses.

#### Risk 4: Curriculum Content Gap
* **Description**: Learner advances to a learning objective node that lacks generated practice items.
* **Impact**: System crash or null pointer error.
* **Mitigation**: Curriculum Store executes graph traversal to automatically fall back to the highest-mastery prerequisite node in the learning tree.`
  },
  {
    id: 'sec_checklist',
    title: '8. Human Review & Security Audit Checklist',
    frNumber: 'Security & Quality Bar',
    summary: 'Verification audit list for Data Security, Retention, Access Control, and Regulatory Compliance.',
    contentMarkdown: `### Security & Compliance Audit Checklist

- [x] **Zero PII Leakage**: Verified that no student name, email, address, or school roster ID is transmitted in prompts to third-party LLM endpoints.
- [x] **Encryption In Transit**: All client-to-server and inter-service calls enforce TLS 1.3 with AES-GCM cipher suites.
- [x] **Encryption At Rest**: PostgreSQL databases, Redis instances, and client IndexedDB stores use AES-256 encryption.
- [x] **RBAC Enforcement**: Learner tokens cannot access teacher dashboard endpoints; teacher tokens restricted to assigned school IDs.
- [x] **Immutable Audit Trail**: Session log hash chain verified against SHA-256 genesis blocks to prevent tampering.
- [x] **Data Retention Policy**: Session logs automatically purged after 90 days; BKT mastery vectors retained for academic year with parent deletion rights (FERPA/COPPA compliant).
- [x] **FERPA / COPPA Compliance**: Parent/Guardian consent mechanisms verified for under-13 student data processing.`
  }
];

export const TRACEABILITY_MATRIX_DATA: TraceabilityRow[] = [
  { frId: 'FR-1', title: 'Real-time Diagnostic Scoring', ownerComponent: 'Diagnostic Engine', description: 'Calculates answer correctness & updates BKT probability within 50ms.', safeguard: 'Atomic Redis lock on state write', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-2', title: 'Misconception Tagging', ownerComponent: 'Diagnostic Engine', description: 'Maps incorrect choices to specific misconception codes (e.g. MIS_RATIO_ADDITIVE_ERROR).', safeguard: 'Rubric validation filter', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-3', title: 'Tiered Model Cost Routing', ownerComponent: 'Personalization Engine', description: 'Routes simple scoring to Tier 1 micro-rules and deep feedback to Gemini Flash.', safeguard: 'Token bucket rate limiter', testStatus: 'VERIFIED' },
  { frId: 'FR-4', title: 'Curriculum-Grounded Feedback', ownerComponent: 'Content Store + Gemini', description: 'Injects verified textbook objectives and misconception rubrics into system prompt.', safeguard: 'Context grounding validator', testStatus: 'VERIFIED' },
  { frId: 'FR-5', title: 'Adaptive Practice Generation', ownerComponent: 'Diagnostic Engine', description: 'Recommends practice items matched to learner’s zone of proximal development.', safeguard: 'Difficulty bounds check', testStatus: 'SIMULATED' },
  { frId: 'FR-6', title: 'Persistent Profile Sync', ownerComponent: 'Learner Profile Store', description: 'Stores updated BKT vectors and misconception frequency counts.', safeguard: 'AES-256 encryption at rest', testStatus: 'VERIFIED' },
  { frId: 'FR-7', title: 'Offline Queueing', ownerComponent: 'Edge Client Service Worker', description: 'Queues answer payloads during network disconnect and syncs when reconnected.', safeguard: 'Signed payload digest', testStatus: 'SIMULATED' },
  { frId: 'FR-8', title: 'Zero PII Scrubbing', ownerComponent: 'API Gateway Sanitizer', description: 'Replaces student identifiers with cryptographic hashes before LLM dispatch.', safeguard: 'Regex + NER pattern engine', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-9', title: 'Teacher Alert Stream', ownerComponent: 'Teacher Dashboard Backend', description: 'Pushes real-time WebSocket notifications when students exhibit repeated misconceptions.', safeguard: 'TLS 1.3 WebSocket stream', testStatus: 'VERIFIED' },
  { frId: 'FR-10', title: 'LLM Cost Budget Cap', ownerComponent: 'Gateway Rate Limiter', description: 'Enforces $0.005/student/day spending ceiling across 5,000 learners.', safeguard: 'Circuit breaker override', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-11', title: 'Immutable Audit Ledger', ownerComponent: 'Audit Logging Service', description: 'Appends SHA-256 hash-chained log entries for every LLM interaction.', safeguard: 'Append-only ledger storage', testStatus: 'VERIFIED' },
  { frId: 'FR-12', title: 'Accessibility Scaffolding', ownerComponent: 'Personalization Engine', description: 'Adjusts prompt reading complexity and hint chunk size based on student profile.', safeguard: 'Reading level classifier', testStatus: 'VERIFIED' },
  { frId: 'FR-13', title: 'Explanation Cache Layer', ownerComponent: 'Redis Cache', description: 'Caches common misconception responses to achieve 85%+ hit rate.', safeguard: 'Key normalization hash', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-14', title: 'LLM Timeout Fallback', ownerComponent: 'Personalization Engine', description: 'Falls back to template hint if LLM response exceeds 1,200ms.', safeguard: 'Strict 1.2s timeout handler', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-15', title: 'Content Gap Fallback', ownerComponent: 'Curriculum Store', description: 'Traverses prerequisite tree when requested learning node is missing.', safeguard: 'Graph fallback traversal', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-16', title: 'Role-Based Access Control', ownerComponent: 'Auth Service', description: 'Enforces strict scope boundaries between learners, teachers, and admins.', safeguard: 'OAuth2 / JWT token validation', testStatus: 'VERIFIED' },
  { frId: 'FR-17', title: 'State OCC Versioning', ownerComponent: 'Learner Profile Store', description: 'Uses version stamps to resolve state conflicts during offline sync.', safeguard: 'Optimistic Concurrency Control', testStatus: 'VERIFIED' },
  { frId: 'FR-18', title: 'Teacher Struggler Flags', ownerComponent: 'Dashboard Backend', description: 'Flags students needing intervention after 3 consecutive wrong answers.', safeguard: 'Automated threshold trigger', testStatus: 'VERIFIED' },
  { frId: 'FR-19', title: 'District Aggregate Metrics', ownerComponent: 'Analytics Service', description: 'Rolls up school-wide performance metrics without exposing individual student PII.', safeguard: 'K-anonymity aggregation (n >= 10)', testStatus: 'AUTOMATED_PASS' },
  { frId: 'FR-20', title: 'Self-Healing Circuit Breaker', ownerComponent: 'External LLM Proxy', description: 'Switches to static fallback templates if third-party LLM API error rate > 5%.', safeguard: 'Automated health ping', testStatus: 'AUTOMATED_PASS' }
];

export const SYSTEM_RISKS: SystemRiskItem[] = [
  {
    id: 'risk_1',
    category: 'LATENCY',
    riskDescription: 'LLM generation latency exceeds classroom threshold (>1,200ms) during morning peak.',
    impactLevel: 'HIGH',
    likelihood: 'MEDIUM',
    mitigationStrategy: 'Enforce strict 1,200ms API timeout in Express proxy. Instantly fall back to pre-rendered static hint template from Redis cache.',
    componentOwner: 'Personalization Engine',
    frMapping: 'FR-14, FR-20'
  },
  {
    id: 'risk_2',
    category: 'CONNECTIVITY',
    riskDescription: 'Classroom Wi-Fi disconnects during active practice session.',
    impactLevel: 'CRITICAL',
    likelihood: 'HIGH',
    mitigationStrategy: 'Progressive Web App (PWA) with Service Worker queues signed event deltas in client IndexedDB. Syncs automatically with OCC versioning upon reconnection.',
    componentOwner: 'Edge Client Service Worker',
    frMapping: 'FR-7, FR-17'
  },
  {
    id: 'risk_3',
    category: 'LLM_COST',
    riskDescription: 'High student usage spikes daily LLM expenses beyond $0.005/student budget cap.',
    impactLevel: 'HIGH',
    likelihood: 'MEDIUM',
    mitigationStrategy: 'Cost-aware Token Bucket rate limiter in Gateway. Warm Redis cache for top 50 misconceptions yields 85%+ hit rate; remaining calls use cheap Gemini 3.6 Flash model.',
    componentOwner: 'Gateway Rate Limiter',
    frMapping: 'FR-3, FR-10, FR-13'
  },
  {
    id: 'risk_4',
    category: 'PII_LEAK',
    riskDescription: 'Accidental transmission of student names or emails to external AI models.',
    impactLevel: 'CRITICAL',
    likelihood: 'LOW',
    mitigationStrategy: 'Sanitizer service strips all student identifiers, replacing them with immutable pseudonyms (ANON_LRN_XXX) before sending prompts.',
    componentOwner: 'API Gateway Sanitizer',
    frMapping: 'FR-8, FR-11'
  },
  {
    id: 'risk_5',
    category: 'CONTENT_GAP',
    riskDescription: 'Learner reaches curriculum node lacking practice questions or rubrics.',
    impactLevel: 'MEDIUM',
    likelihood: 'LOW',
    mitigationStrategy: 'Curriculum Store graph service automatically navigates to prerequisite parent node, preserving session continuity.',
    componentOwner: 'Content Store',
    frMapping: 'FR-15'
  }
];
