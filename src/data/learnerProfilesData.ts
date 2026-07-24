import { LearnerProfile } from '../types';

export const INITIAL_LEARNER_PROFILES: LearnerProfile[] = [
  {
    learnerId: 'lrn_alex_701',
    piiScrubbedId: 'ANON_LRN_701',
    displayName: 'Alex Chen (Grade 7 Math)',
    schoolId: 'sch_oakridge_402',
    schoolName: 'Oakridge Middle School',
    gradeLevel: 7,
    masteryVector: {
      'MATH_7_RATIOS_101': {
        skillId: 'MATH_7_RATIOS_101',
        skillName: 'Ratios & Proportional Relationships',
        masteryProbability: 0.42,
        attemptsCount: 8,
        lastAssessedAt: '2026-07-24T03:15:00Z'
      },
      'MATH_8_LINEAR_201': {
        skillId: 'MATH_8_LINEAR_201',
        skillName: 'Linear Equations',
        masteryProbability: 0.15,
        attemptsCount: 2,
        lastAssessedAt: '2026-07-22T10:00:00Z'
      },
      'SCI_8_NEWTON_301': {
        skillId: 'SCI_8_NEWTON_301',
        skillName: "Newton's Laws",
        masteryProbability: 0.68,
        attemptsCount: 5,
        lastAssessedAt: '2026-07-23T14:20:00Z'
      }
    },
    misconceptionHistory: [
      {
        tag: 'MIS_RATIO_ADDITIVE_ERROR',
        description: 'Learner uses additive reasoning instead of multiplicative reasoning when scaling ratios.',
        frequencyCount: 3,
        lastObservedAt: '2026-07-24T03:15:00Z',
        resolved: false
      }
    ],
    accessibilityPrefs: {
      readingLevel: 'standard',
      textToSpeechEnabled: false,
      highContrastMode: false,
      stepChunkSize: 2
    },
    offlineSyncCursor: 142,
    lastActive: 'Just now'
  },
  {
    learnerId: 'lrn_maya_802',
    piiScrubbedId: 'ANON_LRN_802',
    displayName: 'Maya Patel (Advanced Algebra)',
    schoolId: 'sch_westlake_108',
    schoolName: 'Westlake Middle Academy',
    gradeLevel: 8,
    masteryVector: {
      'MATH_7_RATIOS_101': {
        skillId: 'MATH_7_RATIOS_101',
        skillName: 'Ratios & Proportional Relationships',
        masteryProbability: 0.94,
        attemptsCount: 15,
        lastAssessedAt: '2026-07-20T09:00:00Z'
      },
      'MATH_8_LINEAR_201': {
        skillId: 'MATH_8_LINEAR_201',
        skillName: 'Linear Equations',
        masteryProbability: 0.88,
        attemptsCount: 12,
        lastAssessedAt: '2026-07-24T02:00:00Z'
      },
      'SCI_8_NEWTON_301': {
        skillId: 'SCI_8_NEWTON_301',
        skillName: "Newton's Laws",
        masteryProbability: 0.82,
        attemptsCount: 10,
        lastAssessedAt: '2026-07-23T11:00:00Z'
      }
    },
    misconceptionHistory: [
      {
        tag: 'MIS_SLOPE_INTERCEPT_SWAP',
        description: 'Learner confuses slope m with y-intercept b.',
        frequencyCount: 1,
        lastObservedAt: '2026-07-18T10:00:00Z',
        resolved: true
      }
    ],
    accessibilityPrefs: {
      readingLevel: 'advanced',
      textToSpeechEnabled: false,
      highContrastMode: false,
      stepChunkSize: 4
    },
    offlineSyncCursor: 309,
    lastActive: '12 mins ago'
  },
  {
    learnerId: 'lrn_sam_703',
    piiScrubbedId: 'ANON_LRN_703',
    displayName: 'Sam Taylor (Low-Connectivity Mobile)',
    schoolId: 'sch_riverdale_204',
    schoolName: 'Riverdale Rural School',
    gradeLevel: 7,
    masteryVector: {
      'MATH_7_RATIOS_101': {
        skillId: 'MATH_7_RATIOS_101',
        skillName: 'Ratios & Proportional Relationships',
        masteryProbability: 0.35,
        attemptsCount: 4,
        lastAssessedAt: '2026-07-23T16:00:00Z'
      },
      'SCI_8_NEWTON_301': {
        skillId: 'SCI_8_NEWTON_301',
        skillName: "Newton's Laws",
        masteryProbability: 0.50,
        attemptsCount: 3,
        lastAssessedAt: '2026-07-21T13:00:00Z'
      }
    },
    misconceptionHistory: [
      {
        tag: 'MIS_ORDER_INVERSION',
        description: 'Inverts denominator/numerator during rate calculation.',
        frequencyCount: 2,
        lastObservedAt: '2026-07-23T16:00:00Z',
        resolved: false
      }
    ],
    accessibilityPrefs: {
      readingLevel: 'foundational',
      textToSpeechEnabled: true,
      highContrastMode: true,
      stepChunkSize: 1
    },
    offlineSyncCursor: 88,
    lastActive: '1 hr ago'
  }
];
