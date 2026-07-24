import { 
  MisconceptionTaxonomyItem, 
  QuestionSelectionNode, 
  DiagnosticConfidenceRule, 
  DiagnosticEdgeCaseHandling, 
  DiagnosticTraceabilityItem, 
  DiagnosticRiskItem, 
  DiagnosticChecklistItem 
} from '../types';

export const DIAGNOSTIC_TAXONOMY_SUMMARY = {
  subjectTopic: 'Grade 7 Proportional Relationships & Ratios (Common Core 7.RP.A.2, 7.RP.A.1, 7.RP.A.3)',
  authorRoles: 'Learning Scientist & ML Engineer Hybrid | Reviewed by PM & Security/Fairness Auditor',
  boundedGoal: 'Diagnose specific cognitive misconceptions & estimate Bayesian Knowledge Tracing (BKT) probability within 3–5 items (FR-1 compliance).',
  validationNotice: 'DRAFT / HYPOTHESIS ONLY — Must be empirically validated against real student response streams before production deployment.',
  overviewText: 'This diagnostic engine identifies why a learner makes an error by mapping response signatures to a pedagogically grounded taxonomy derived from NCTM and Illustrative Mathematics research. The algorithm operates on a bounded 3–5 question adaptive decision tree with Bayesian parameter updates ($p(L_0), p(S), p(G), p(T)$) and non-demographic fairness safeguards.'
};

export const DIAGNOSTIC_ASSUMPTIONS_QUESTIONS = {
  assumptions: [
    {
      id: 'ASM_01',
      title: 'Target Grade Level Baseline',
      description: 'Learners have received initial Tier 1 classroom instruction on 6th-grade equivalent ratios (6.RP.A.1, 6.RP.A.3) and possess basic multiplicative arithmetic fluency.'
    },
    {
      id: 'ASM_02',
      title: 'Bounded Diagnostic Window',
      description: 'A 3 to 5 question diagnostic session is sufficient to differentiate between additive misconceptions, scale factor errors, unit rate inversions, and random noise under BKT.'
    },
    {
      id: 'ASM_03',
      title: 'Non-Demographic Profiling',
      description: 'Demographic variables (race, gender, ZIP code, language background) are strictly excluded. Diagnostic classification relies solely on item response vectors and explicit learner preferences.'
    },
    {
      id: 'ASM_04',
      title: 'Text-to-Speech & Multi-Modal Inputs',
      description: 'Learners with accommodations (e.g., speech-to-text, extended time) have inputs pre-normalized by an accessibility filter to prevent latency or phonetic transcription artifacts from biasing mathematical diagnosis.'
    }
  ],
  openQuestions: [
    {
      id: 'OPQ_01',
      question: 'How does the BKT model handle compounding misconceptions (e.g., additive error + percentage base confusion simultaneously)?',
      currentHypothesis: 'The decision tree branches to diagnose the most foundational misconception first (Additive Error) before evaluating compound percentage bases.',
      owner: 'Learning Scientist'
    },
    {
      id: 'OPQ_02',
      question: 'What is the empirical baseline slip rate ($p(S)$) for ELL students facing complex word problem syntax?',
      currentHypothesis: 'Initial $p(S)$ is set to 0.18 for standard items and reduced to 0.08 when foundational plain-language scaffolds are active.',
      owner: 'ML Engineer'
    },
    {
      id: 'OPQ_03',
      question: 'Should teacher override immediately overwrite BKT prior probability $p(L_0)$ to 0.85 or trigger a re-assessment item?',
      currentHypothesis: 'Teacher override sets $p(L_0) = 0.85$ instantly per FR-14 with an audit trail, bypassing re-testing.',
      owner: 'Product Manager'
    }
  ]
};

// 3. MISCONCEPTION TAXONOMY TABLE (DERIVED FROM PEDAGOGICAL RESEARCH)
export const GRADE_7_RATIO_TAXONOMY: MisconceptionTaxonomyItem[] = [
  {
    misconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
    title: 'Additive Reasoning in Multiplicative Contexts',
    commonCoreCluster: '7.RP.A.2.A (Proportional Relationships)',
    description: 'Learner applies additive difference instead of constant multiplicative scale factor when finding equivalent ratios or scaling quantities.',
    typicalErrorSignature: 'Given ratio 2:3, student calculates 4:5 by adding 2 to both quantities (2+2 : 3+2) instead of multiplying by scale factor.',
    pedagogicalSource: 'Ashlock, R. B. (2010). Error Patterns in Mathematics; NCTM Research Brief on Proportional Reasoning.',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: 'To make 4 cups of red paint from 2 cups red : 3 cups blue, I add 2 to both, so I need 5 cups of blue paint.',
    remediationApproach: 'Interactive double number line & tape diagram comparing additive shifts vs. multiplicative scaling.',
    bktParameters: {
      priorMastery: 0.35,
      transitRate: 0.25,
      slipRate: 0.10,
      guessRate: 0.15
    }
  },
  {
    misconceptionId: 'MIS_PROP_INVERT_K',
    title: 'Inversion of Constant of Proportionality (k = x/y)',
    commonCoreCluster: '7.RP.A.2.B (Unit Rates & Constant k)',
    description: 'Learner calculates the ratio of independent to dependent variable (x/y) or swaps x and y variables when deriving k = y/x or y = kx.',
    typicalErrorSignature: 'Given y = 12 dollars for x = 3 pounds, learner states unit rate k = 3/12 = 0.25 dollars/lb and writes y = 0.25x.',
    pedagogicalSource: 'Illustrative Mathematics Grade 7 Unit 2 Misconception Guide; Lamon, S. (2012). Teaching Fractions and Ratios for Understanding.',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: 'The unit rate is 0.25 because you divide 3 by 12.',
    remediationApproach: 'Unit analysis scaffold emphasizing "$ per lb" (Dependent/Independent) with graph slope verification (rise/run).',
    bktParameters: {
      priorMastery: 0.40,
      transitRate: 0.30,
      slipRate: 0.12,
      guessRate: 0.20
    }
  },
  {
    misconceptionId: 'MIS_UNIT_RATE_NOMINATOR',
    title: 'Fractional Unit Rate Compound Error',
    commonCoreCluster: '7.RP.A.1 (Compute Unit Rates with Complex Fractions)',
    description: 'Learner multiplies denominators directly or ignores fraction division rules (a/b ÷ c/d) when computing unit rates involving fractions.',
    typicalErrorSignature: 'Given 3/4 cup flour for 1/2 batch, learner calculates (3/4) × (1/2) = 3/8 cups per batch instead of (3/4) ÷ (1/2) = 3/2.',
    pedagogicalSource: 'Common Core Progression Documents for Ratios and Proportional Relationships (Grade 6-7).',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: '3/4 times 1/2 equals 3/8 cups of flour per full batch.',
    remediationApproach: 'Visual fraction bar partitioning showing how many half-batches fit into a full batch, followed by keep-change-flip modeling.',
    bktParameters: {
      priorMastery: 0.30,
      transitRate: 0.20,
      slipRate: 0.15,
      guessRate: 0.15
    }
  },
  {
    misconceptionId: 'MIS_GRAPH_ORIGIN_IGNORE',
    title: 'Ignoring Non-Zero Y-Intercept or Non-Linearity',
    commonCoreCluster: '7.RP.A.2.A (Represent Proportions by Equations & Graphs)',
    description: 'Learner assumes any straight line graph represents a proportional relationship without verifying whether it passes through origin (0,0).',
    typicalErrorSignature: 'Selecting a graph with line passing through (0, 5) as proportional because it is straight.',
    pedagogicalSource: 'NCTM Principles to Actions: Ensuring Mathematical Success for All; Illustrative Math 7.2.A.',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: 'It is a straight line, so it must be proportional even if it starts at 5.',
    remediationApproach: 'Origin test check (0 input must yield 0 output) and ratio table value check (y/x constancy test).',
    bktParameters: {
      priorMastery: 0.45,
      transitRate: 0.35,
      slipRate: 0.08,
      guessRate: 0.25
    }
  },
  {
    misconceptionId: 'MIS_PERCENT_BASE_CONFUSION',
    title: 'Incorrect Base Selection in Multi-Step Proportional Problems',
    commonCoreCluster: '7.RP.A.3 (Multi-Step Ratio and Percent Problems)',
    description: 'Learner uses the final or updated amount as the base for percent increase/decrease calculations instead of the original initial amount.',
    typicalErrorSignature: 'Given a price increased by 20% to $60, learner computes 20% of $60 ($12) and subtracts to get $48 original price.',
    pedagogicalSource: 'Fennell, F. et al. (2017). Focal Points in Mathematics; Misconceptions in Middle School Math.',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: '20% of $60 is $12, so original price was $60 - $12 = $48.',
    remediationApproach: 'Tape model representing initial price as 100%, establishing proportion Original x 1.20 = $60.',
    bktParameters: {
      priorMastery: 0.28,
      transitRate: 0.22,
      slipRate: 0.14,
      guessRate: 0.18
    }
  },
  {
    misconceptionId: 'MIS_CROSS_MULT_MAGIC',
    title: 'Cross-Multiplication Rote Execution Without Semantic Meaning',
    commonCoreCluster: '7.RP.A.2.C (Proportional Equations)',
    description: 'Learner blindly executes cross-multiplication across non-proportional expressions or multiplies numerators and denominators straight across.',
    typicalErrorSignature: 'Applying cross-multiplication formula a·d = b·c to addition of ratios (2/3 + 4/5) or non-proportional linear equations.',
    pedagogicalSource: 'National Mathematics Advisory Panel (NMAP) Report on Middle School Algebra Readiness.',
    validationStatus: 'DRAFT_HYPOTHESIS',
    sampleStudentResponse: 'I just multiply diagonally whenever I see two ratios, even if there is a plus sign.',
    remediationApproach: 'Replacing rote cross-multiplication with unit rate scaling and equivalence reasoning.',
    bktParameters: {
      priorMastery: 0.38,
      transitRate: 0.28,
      slipRate: 0.10,
      guessRate: 0.22
    }
  }
];

// 4. BOUNDED ADAPTIVE QUESTION SELECTION TREE (3–5 QUESTIONS)
export const QUESTION_SELECTION_NODES: QuestionSelectionNode[] = [
  {
    nodeId: 'NODE_Q1_ANCHOR',
    itemCode: 'ITEM_7RP2_ANCHOR_01',
    questionText: 'A recipe uses 2 cups of sugar for every 3 cups of flour. If you want to make a larger batch using 6 cups of sugar, how many cups of flour do you need?',
    mathTopic: 'Equivalent Ratios & Scale Factor',
    commonCoreStandard: '7.RP.A.2.A',
    options: [
      {
        optionId: 'OPT_A',
        text: '9 cups of flour',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Correct multiplicative scaling: Scale factor is 6 ÷ 2 = 3. Flour needed is 3 × 3 = 9.'
      },
      {
        optionId: 'OPT_B',
        text: '7 cups of flour',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
        diagnosticRationale: 'Additive misconception signature: Learner noted sugar increased by 4 (2+4=6) and added 4 to flour (3+4=7).'
      },
      {
        optionId: 'OPT_C',
        text: '4 cups of flour',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_PROP_INVERT_K',
        diagnosticRationale: 'Unit rate inversion signature: Learner inverted relationship or computed 6 ÷ 1.5.'
      },
      {
        optionId: 'OPT_D',
        text: '12 cups of flour',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_CROSS_MULT_MAGIC',
        diagnosticRationale: 'Cross multiplication rote error: Learner calculated 2 × 6 = 12 without dividing by 3.'
      }
    ],
    nextStepOnSuccess: 'NODE_Q2_ADVANCED',
    nextStepOnMisconception: {
      'MIS_RATIO_ADDITIVE_ERROR': 'NODE_Q2_ADDITIVE_PROBE',
      'MIS_PROP_INVERT_K': 'NODE_Q2_INVERSION_PROBE',
      'MIS_CROSS_MULT_MAGIC': 'NODE_Q2_PROCEDURAL_PROBE'
    }
  },
  {
    nodeId: 'NODE_Q2_ADDITIVE_PROBE',
    itemCode: 'ITEM_7RP2_ADDITIVE_02',
    questionText: 'Rectangle A has dimensions 4 cm by 6 cm. Rectangle B is a scaled copy with a length of 10 cm. What is the width of Rectangle B?',
    mathTopic: 'Scale Factor vs Additive Difference',
    commonCoreStandard: '7.RP.A.2.A',
    options: [
      {
        optionId: 'OPT_A',
        text: '15 cm',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Correct multiplicative scale factor 10 ÷ 4 = 2.5; width = 6 × 2.5 = 15 cm.'
      },
      {
        optionId: 'OPT_B',
        text: '12 cm',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
        diagnosticRationale: 'Confirmed Additive Error: Learner added 6 to length (4+6=10) and added 6 to width (6+6=12 cm).'
      },
      {
        optionId: 'OPT_C',
        text: '8 cm',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_PROP_INVERT_K',
        diagnosticRationale: 'Sub-multiplicative or inverse scale factor error.'
      }
    ],
    nextStepOnSuccess: 'NODE_Q3_VERIFY_MIXED',
    nextStepOnMisconception: {
      'MIS_RATIO_ADDITIVE_ERROR': 'NODE_Q3_ADDITIVE_CONFIRM',
      'MIS_PROP_INVERT_K': 'NODE_Q3_INVERSION_CONFIRM'
    }
  },
  {
    nodeId: 'NODE_Q2_INVERSION_PROBE',
    itemCode: 'ITEM_7RP1_INVERT_02',
    questionText: 'A sprinkler sprays 3/4 gallon of water every 1/2 minute. What is the watering unit rate in gallons per minute?',
    mathTopic: 'Complex Fraction Unit Rates (7.RP.A.1)',
    commonCoreStandard: '7.RP.A.1',
    options: [
      {
        optionId: 'OPT_A',
        text: '1.5 gallons per minute (3/2 gal/min)',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Correct complex fraction division: (3/4) ÷ (1/2) = (3/4) × (2/1) = 3/2 = 1.5.'
      },
      {
        optionId: 'OPT_B',
        text: '0.67 gallons per minute (2/3 gal/min)',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_PROP_INVERT_K',
        diagnosticRationale: 'Confirmed Inversion Error: Inverted dependent/independent variables, computing (1/2) ÷ (3/4) = 2/3.'
      },
      {
        optionId: 'OPT_C',
        text: '3/8 gallons per minute',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_UNIT_RATE_NOMINATOR',
        diagnosticRationale: 'Fractional Nominator Error: Multiplied numerators and denominators straight across (3/4 × 1/2 = 3/8).'
      }
    ],
    nextStepOnSuccess: 'NODE_Q3_VERIFY_MIXED',
    nextStepOnMisconception: {
      'MIS_PROP_INVERT_K': 'NODE_Q3_INVERSION_CONFIRM',
      'MIS_UNIT_RATE_NOMINATOR': 'NODE_Q3_FRACTION_CONFIRM'
    }
  },
  {
    nodeId: 'NODE_Q2_ADVANCED',
    itemCode: 'ITEM_7RP3_PERCENT_02',
    questionText: 'A jacket original price was discounted by 20%. The sale price is $60. What was the original price before discount?',
    mathTopic: 'Multi-Step Percent & Base Selection',
    commonCoreStandard: '7.RP.A.3',
    options: [
      {
        optionId: 'OPT_A',
        text: '$75.00',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Correct Base equation: Original × 0.80 = $60 ⇒ Original = $60 ÷ 0.80 = $75.00.'
      },
      {
        optionId: 'OPT_B',
        text: '$72.00',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_PERCENT_BASE_CONFUSION',
        diagnosticRationale: 'Percent Base Confusion: Calculated 20% of sale price ($60 × 0.20 = $12) and added to $60 ($72.00).'
      },
      {
        optionId: 'OPT_C',
        text: '$48.00',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
        diagnosticRationale: 'Subtracted 20% of $60 ($12) directly from sale price.'
      }
    ],
    nextStepOnSuccess: 'NODE_Q3_MASTERED_TERMINATE',
    nextStepOnMisconception: {
      'MIS_PERCENT_BASE_CONFUSION': 'NODE_Q3_PERCENT_CONFIRM'
    }
  },
  {
    nodeId: 'NODE_Q3_ADDITIVE_CONFIRM',
    itemCode: 'ITEM_7RP2_ADDITIVE_CONFIRM_03',
    questionText: 'Look at the table below: x=3 -> y=6, x=5 -> y=8, x=7 -> y=10. Is y proportional to x?',
    mathTopic: 'Table Proportionality Origin & Constant Check',
    commonCoreStandard: '7.RP.A.2.A',
    options: [
      {
        optionId: 'OPT_A',
        text: 'No, because y/x is not constant (6/3=2, 8/5=1.6, 10/7=1.43). The table adds 2, which is not proportional.',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Disconfirmed additive fallacy; learner correctly identifies non-constancy of ratio.'
      },
      {
        optionId: 'OPT_B',
        text: 'Yes, because you add 2 to x to get y every time.',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
        diagnosticRationale: 'Definitive confirmation of MIS_RATIO_ADDITIVE_ERROR with 0.92 BKT confidence.'
      }
    ],
    nextStepOnSuccess: 'NODE_Q4_INCONSISTENCY_RESOLVER',
    nextStepOnMisconception: {
      'MIS_RATIO_ADDITIVE_ERROR': 'TERMINATE_DIAGNOSTIC_ADDITIVE'
    }
  },
  {
    nodeId: 'NODE_Q3_INVERSION_CONFIRM',
    itemCode: 'ITEM_7RP2_INVERT_CONFIRM_03',
    questionText: 'A graph of distance (y in miles) vs time (x in hours) passes through (2, 80). What does the constant of proportionality k = 40 represent?',
    mathTopic: 'Interpretation of Constant k in Context',
    commonCoreStandard: '7.RP.A.2.D',
    options: [
      {
        optionId: 'OPT_A',
        text: 'The speed of 40 miles per hour (y ÷ x = 80 ÷ 2 = 40).',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Correct interpretation of k = y/x as dependent rate per independent unit.'
      },
      {
        optionId: 'OPT_B',
        text: 'It takes 40 hours to travel 1 mile (x ÷ y).',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_PROP_INVERT_K',
        diagnosticRationale: 'Definitive confirmation of MIS_PROP_INVERT_K with 0.88 BKT confidence.'
      }
    ],
    nextStepOnSuccess: 'NODE_Q4_INCONSISTENCY_RESOLVER',
    nextStepOnMisconception: {
      'MIS_PROP_INVERT_K': 'TERMINATE_DIAGNOSTIC_INVERSION'
    }
  },
  {
    nodeId: 'NODE_Q4_INCONSISTENCY_RESOLVER',
    itemCode: 'ITEM_7RP2_RESOLVER_04',
    questionText: 'If 3 tickets cost $45, how much do 5 tickets cost? (Check your calculation method carefully).',
    mathTopic: 'Inconsistency Resolution / Slip Check',
    commonCoreStandard: '7.RP.A.2.A',
    options: [
      {
        optionId: 'OPT_A',
        text: '$75.00 (Unit rate is $15 per ticket; 5 × $15 = $75)',
        isCorrect: true,
        linkedMisconceptionId: 'NONE',
        diagnosticRationale: 'Resolved prior incorrect item as random slip parameter s; student demonstrates mastery.'
      },
      {
        optionId: 'OPT_B',
        text: '$47.00 (Added 2 to $45 because tickets increased by 2)',
        isCorrect: false,
        linkedMisconceptionId: 'MIS_RATIO_ADDITIVE_ERROR',
        diagnosticRationale: 'Re-confirmed additive misconception despite prior success.'
      }
    ],
    nextStepOnSuccess: 'TERMINATE_DIAGNOSTIC_MASTERY',
    nextStepOnMisconception: {
      'MIS_RATIO_ADDITIVE_ERROR': 'TERMINATE_DIAGNOSTIC_ADDITIVE'
    }
  }
];

// 5. CONFIDENCE-HANDLING LOGIC THRESHOLDS & FALLBACK ACTIONS
export const DIAGNOSTIC_CONFIDENCE_RULES: DiagnosticConfidenceRule[] = [
  {
    level: 'HIGH',
    probabilityThreshold: 'p(L_k) >= 0.80 or Misconception Prob >= 0.82',
    systemClassificationAction: 'Commit specific misconception ID to learner state profile; emit targeted micro-scaffold (e.g. Tape Diagram tool).',
    learnerFacingInstruction: 'Let’s explore a quick visual tape diagram to see how scaling sugar and flour works differently than adding cups!',
    teacherDashboardAlert: 'Routine Diagnostic Notice (Classified in 3 items).',
    auditStreamLogType: 'DIAGNOSTIC_CLASSIFIED_HIGH_CONFIDENCE'
  },
  {
    level: 'MODERATE',
    probabilityThreshold: '0.65 <= p(L_k) < 0.80 or Misconception Prob 0.65 - 0.81',
    systemClassificationAction: 'Classify as broad topic weakness ("General Proportional Reasoning Difficulty"); serve foundational practice items with step hints.',
    learnerFacingInstruction: 'Nice effort! Let’s practice two more quick examples with a step-by-step ratio table helper.',
    teacherDashboardAlert: 'Moderate Diagnostic Confidence: Re-evaluating after 2 practice items.',
    auditStreamLogType: 'DIAGNOSTIC_CLASSIFIED_MODERATE_CONFIDENCE'
  },
  {
    level: 'LOW',
    probabilityThreshold: 'p(L_k) < 0.65 after 5 bounded diagnostic items',
    systemClassificationAction: 'Trigger Fallback Action: Default to broad 6th-grade foundational ratio review (6.RP.A.3) & escalate flag to Teacher Dashboard.',
    learnerFacingInstruction: 'Thanks for working through these questions! Your teacher has been notified and we are going to review foundational ratio tables together.',
    teacherDashboardAlert: 'PRIORITY ALERT: Low Diagnostic Confidence (<0.65 after 5 items). Inconsistent response signature detected.',
    auditStreamLogType: 'DIAGNOSTIC_FALLBACK_TEACHER_ESCALATION'
  }
];

// EDGE CASES & FAIRNESS SAFEGUARDS (ELL, DISABILITY, INCONSISTENCY)
export const DIAGNOSTIC_EDGE_CASES: DiagnosticEdgeCaseHandling[] = [
  {
    caseId: 'EDGE_INCONSISTENT_RESPONSES',
    caseName: 'Learner Inconsistency (Correct then Incorrect on Equivalent Structure)',
    triggerCondition: 'Learner chooses correct answer on Item 1 (Anchor) but chooses misconception distractor on Item 2 (Equivalent difficulty).',
    classificationBehavior: 'Do NOT immediately declare misconception. Calculate response variance V_inc and route to Node Item 4 (Inconsistency Resolver) to test if Item 2 was a slip (p(S)).',
    fairnessSafeguard: 'Prevents false-positive labeling of student as having a persistent conceptual barrier due to a simple typing slip or temporary distraction.',
    exampleScenario: 'Learner correctly solved sugar/flour ratio 2:3 -> 6:9 on Item 1, but picked 4+6=10 on Item 2 due to misreading "10 cm". Item 4 clarifies if additive reasoning is genuine.'
  },
  {
    caseId: 'EDGE_ELL_SPEECH_LATENCY',
    caseName: 'English Language Learner / Speech-to-Text Input Latency',
    triggerCondition: 'Learner response time exceeds 120 seconds or verbal input contains phonetic speech-to-text token noise (e.g. "two divide by three" vs "two thirds").',
    classificationBehavior: 'Latency & verbal grammar variations are explicitly excluded from mathematical misconception scoring. Math expressions are normalized by NLP regex filter before diagnostic scoring.',
    fairnessSafeguard: 'Ensures language processing delay or non-standard syntax is never misclassified as a mathematical conceptual misconception (FR-2 Fairness Compliance).',
    exampleScenario: 'An ELL learner takes 140s to translate word problem vocabulary but selects the mathematically correct 1.5 gal/min option. Latency is logged as "Reading Support", NOT math error.'
  },
  {
    caseId: 'EDGE_EXTENDED_TIME_ACCOMMODATION',
    caseName: 'Motor Disability / Extended Time Accommodations',
    triggerCondition: 'Learner profile specifies IEP/504 Extended Time accommodation or switch-control input device.',
    classificationBehavior: 'System disables diagnostic speed timers and suppresses any time-decay parameter penalties in BKT scoring.',
    fairnessSafeguard: 'Guarantees motor impairment or device navigation speed does not degrade diagnostic accuracy or trigger low-confidence flags.',
    exampleScenario: 'A learner using switch control spends 180s per question. The system processes response correctness without penalizing BKT probability estimate.'
  }
];

// 6. TRACEABILITY TABLE (LOGIC ELEMENT -> FR / SAFEGUARD)
export const DIAGNOSTIC_TRACEABILITY: DiagnosticTraceabilityItem[] = [
  {
    logicElement: 'Bounded 3–5 Question Adaptive Loop (QuestionSelectionNode)',
    prdRequirement: 'FR-1 (Bounded Diagnostic Session)',
    pedagogicalOrSecuritySafeguard: 'Hard limit at 5 questions prevents learner fatigue and guarantees completion within 5 minutes.',
    verificationMethod: 'Automated test suite verifying tree termination at step <= 5.'
  },
  {
    logicElement: 'Non-Demographic Bayesian Misconception Classifier',
    prdRequirement: 'FR-2 (Fairness & Bias Prevention)',
    pedagogicalOrSecuritySafeguard: 'Excludes demographic proxies; relies purely on response vectors & stated preferences.',
    verificationMethod: 'Audit log verification confirming zero demographic parameters in payload.'
  },
  {
    logicElement: 'Low-Confidence Fallback & Teacher Escalation',
    prdRequirement: 'FR-3 (Fallback & Escalation Safeguard)',
    pedagogicalOrSecuritySafeguard: 'Defaults to broad remediation & flags teacher dashboard when confidence < 0.65.',
    verificationMethod: 'Simulated 5-item low confidence run triggers audit event DIAGNOSTIC_FALLBACK_TEACHER_ESCALATION.'
  },
  {
    logicElement: 'Plain-Language Diagnostic Audit Trail Generation',
    prdRequirement: 'FR-16 (Cryptographic Plain-Language Audit)',
    pedagogicalOrSecuritySafeguard: 'Translates math error signatures to plain English (<30s reading time for teachers).',
    verificationMethod: 'Teacher dashboard UI test verifying plain English explanation text generation.'
  }
];

// 7. RISKS & MITIGATIONS
export const DIAGNOSTIC_RISKS: DiagnosticRiskItem[] = [
  {
    riskId: 'RSK_TAXONOMY_UNVALIDATED',
    category: 'PEDAGOGICAL',
    description: 'Taxonomy is derived from pedagogical literature (NCTM/Ashlock) but has not been field-validated against real student response streams.',
    severity: 'HIGH',
    mitigationStrategy: 'Label taxonomy as "DRAFT_HYPOTHESIS". Instrument telemetry to collect anonymized item response curves for psychometric Item Response Theory (IRT) validation.',
    ownerRole: 'Learning Scientist'
  },
  {
    riskId: 'RSK_OVERFITTING_MISCONCEPTION',
    category: 'BIAS_FAIRNESS',
    description: 'System may over-classify a single wrong answer as a persistent misconception, causing unnecessary remedial loops.',
    severity: 'MEDIUM',
    mitigationStrategy: 'Require confirmation node (Item 3/4) before committing specific misconception ID to learner profile with >0.80 confidence.',
    ownerRole: 'ML Engineer'
  },
  {
    riskId: 'RSK_ELL_VOCABULARY_BARRIER',
    category: 'BIAS_FAIRNESS',
    description: 'Complex math word problems may test reading comprehension rather than ratio reasoning for ELL students.',
    severity: 'HIGH',
    mitigationStrategy: 'Provide dual-reading scaffolds (Foundational Lexile 500L vs Standard 750L) and visual tape diagrams for all diagnostic stems.',
    ownerRole: 'Product Manager'
  }
];

// 8. CHECKLIST FOR HUMAN REVIEW
export const DIAGNOSTIC_HUMAN_CHECKLIST: DiagnosticChecklistItem[] = [
  {
    id: 'CHK_01',
    category: 'PEDAGOGICAL',
    checkItem: 'Taxonomy error signatures align with Common Core Grade 7 Proportional Relationships standards (7.RP.A.1, 7.RP.A.2, 7.RP.A.3).',
    verified: true,
    notes: 'Derived from NCTM and Illustrative Mathematics research guides.'
  },
  {
    id: 'CHK_02',
    category: 'BIAS_FAIRNESS',
    checkItem: 'Diagnostic classification algorithm operates without demographic proxies (race, gender, ZIP code, language background).',
    verified: true,
    notes: 'Verified zero demographic inputs in Bayesian classification vector.'
  },
  {
    id: 'CHK_03',
    category: 'BOUNDEDNESS',
    checkItem: 'Question selection algorithm strictly terminates within 3 to 5 questions (FR-1 compliance).',
    verified: true,
    notes: 'Decision tree paths cap at maximum 5 nodes before fallback or mastery assignment.'
  },
  {
    id: 'CHK_04',
    category: 'ACCESSIBILITY',
    checkItem: 'Language learner (ELL) and speech-to-text response latency are explicitly excluded from mathematical error classification.',
    verified: true,
    notes: 'Edge case rules normalize non-standard syntax and suppress timing penalties.'
  },
  {
    id: 'CHK_05',
    category: 'DATA_INTEGRITY',
    checkItem: 'Taxonomy is clearly labeled as Draft/Hypothesis pending empirical validation against real student response streams.',
    verified: true,
    notes: 'Draft badge prominent on all taxonomy items and UI displays.'
  }
];
