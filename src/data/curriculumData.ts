import { CurriculumNode } from '../types';

export const CURRICULUM_NODES: Record<string, CurriculumNode> = {
  'MATH_7_RATIOS_101': {
    id: 'MATH_7_RATIOS_101',
    title: 'Ratios & Proportional Relationships',
    subject: 'Mathematics',
    gradeLevel: 7,
    learningObjective: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    prerequisites: ['MATH_6_FRACTIONS_BASIC'],
    nextRecommendedNodes: ['MATH_7_UNIT_RATES_102', 'MATH_7_PROPORTIONAL_GRAPHS_103'],
    commonMisconceptions: [
      {
        tag: 'MIS_RATIO_ADDITIVE_ERROR',
        description: 'Learner uses additive reasoning instead of multiplicative reasoning when scaling ratios.',
        remediationStrategy: 'Provide visual bar models comparing additive step vs scaling multiplier.'
      },
      {
        tag: 'MIS_ORDER_INVERSION',
        description: 'Learner reverses numerator and denominator in unit rate calculation.',
        remediationStrategy: 'Emphasize labelled units ($/gallon, miles/hour) before numerical operations.'
      },
      {
        tag: 'MIS_PERCENT_DECIMAL_CONFUSION',
        description: 'Learner treats 15% ratio as 0.015 or 15 without converting to a fraction out of 100.',
        remediationStrategy: 'Use 10x10 grid visual scaffolding to ground percentage as hundredths.'
      }
    ],
    questions: [
      {
        id: 'Q_RATIO_1',
        nodeId: 'MATH_7_RATIOS_101',
        questionText: 'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you double the recipe and use 6 cups of sugar, how many cups of flour do you need?',
        difficultyIndex: 0.3,
        correctChoiceId: 'choice_b',
        scaffoldedHints: [
          'Identify the original ratio: 2 flour to 3 sugar (2:3).',
          'Sugar went from 3 cups to 6 cups. What number did we multiply 3 by to get 6?',
          'Multiply the flour quantity (2 cups) by that same scale factor (2).'
        ],
        choices: [
          { id: 'choice_a', text: '5 cups of flour', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Added 3 to both quantities instead of multiplying by scale factor 2.' },
          { id: 'choice_b', text: '4 cups of flour' },
          { id: 'choice_c', text: '9 cups of flour', misconceptionTag: 'MIS_ORDER_INVERSION', misconceptionDescription: 'Inverted ratio multiplier (3 * 3 = 9).' },
          { id: 'choice_d', text: '6 cups of flour', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Assumed equal quantities of both ingredients.' }
        ]
      },
      {
        id: 'Q_RATIO_2',
        nodeId: 'MATH_7_RATIOS_101',
        questionText: 'A car travels 150 miles in 3 hours at a constant speed. What is the unit rate in miles per hour?',
        difficultyIndex: 0.4,
        correctChoiceId: 'choice_a',
        scaffoldedHints: [
          'Unit rate means how many miles in 1 single hour.',
          'Divide total miles by total hours: 150 miles ÷ 3 hours.'
        ],
        choices: [
          { id: 'choice_a', text: '50 miles per hour' },
          { id: 'choice_b', text: '0.02 hours per mile', misconceptionTag: 'MIS_ORDER_INVERSION', misconceptionDescription: 'Divided hours by miles (3 / 150).' },
          { id: 'choice_c', text: '450 miles per hour', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Multiplied instead of dividing (150 * 3).' },
          { id: 'choice_d', text: '147 miles per hour', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Subtracted 3 hours from 150 miles.' }
        ]
      }
    ]
  },
  'MATH_8_LINEAR_201': {
    id: 'MATH_8_LINEAR_201',
    title: 'Linear Equations & Slope-Intercept Form',
    subject: 'Mathematics',
    gradeLevel: 8,
    learningObjective: 'Interpret the equation y = mx + b as defining a linear function whose graph is a straight line.',
    prerequisites: ['MATH_7_PROPORTIONAL_GRAPHS_103'],
    nextRecommendedNodes: ['MATH_8_SYSTEMS_202'],
    commonMisconceptions: [
      {
        tag: 'MIS_SLOPE_INTERCEPT_SWAP',
        description: 'Learner confuses slope m with y-intercept b in y = mx + b.',
        remediationStrategy: 'Identify x=0 point first to isolate the initial starting value b.'
      },
      {
        tag: 'MIS_NEGATIVE_SLOPE_DIRECTION',
        description: 'Learner plots negative slope as increasing from left to right.',
        remediationStrategy: 'Relate negative slope to downhill motion from left to right.'
      }
    ],
    questions: [
      {
        id: 'Q_LINEAR_1',
        nodeId: 'MATH_8_LINEAR_201',
        questionText: 'What is the slope (m) of the line represented by the equation y = -3x + 7?',
        difficultyIndex: 0.2,
        correctChoiceId: 'choice_c',
        scaffoldedHints: [
          'Compare the given equation y = -3x + 7 to standard slope-intercept form y = mx + b.',
          'The coefficient directly in front of x is the slope m.'
        ],
        choices: [
          { id: 'choice_a', text: '7', misconceptionTag: 'MIS_SLOPE_INTERCEPT_SWAP', misconceptionDescription: 'Selected y-intercept (b) instead of slope (m).' },
          { id: 'choice_b', text: '3', misconceptionTag: 'MIS_NEGATIVE_SLOPE_DIRECTION', misconceptionDescription: 'Ignored the negative sign attached to the slope.' },
          { id: 'choice_c', text: '-3' },
          { id: 'choice_d', text: '-3/7', misconceptionTag: 'MIS_ORDER_INVERSION', misconceptionDescription: 'Attempted ratio division of m and b.' }
        ]
      }
    ]
  },
  'SCI_8_NEWTON_301': {
    id: 'SCI_8_NEWTON_301',
    title: "Physics: Newton's Second Law of Motion (F = ma)",
    subject: 'Science',
    gradeLevel: 8,
    learningObjective: 'Plan an investigation to provide evidence that the change in an object’s motion depends on the sum of forces and mass.',
    prerequisites: ['MATH_7_RATIOS_101'],
    nextRecommendedNodes: ['SCI_8_NEWTON_302'],
    commonMisconceptions: [
      {
        tag: 'MIS_FORCE_REQUIRES_MOTION',
        description: 'Learner believes an object in motion must always have a continuous active net force acting on it.',
        remediationStrategy: 'Contrast net force with inertia; constant velocity means net force is ZERO.'
      },
      {
        tag: 'MIS_MASS_WEIGHT_EQUATE',
        description: 'Learner treats mass (kg) and weight (N) as identical physical quantities.',
        remediationStrategy: 'Ground mass as amount of matter vs weight as gravitational pull on that matter.'
      }
    ],
    questions: [
      {
        id: 'Q_NEWTON_1',
        nodeId: 'SCI_8_NEWTON_301',
        questionText: 'A 10 kg sled is pushed across ice with a net force of 30 N. What is its acceleration?',
        difficultyIndex: 0.3,
        correctChoiceId: 'choice_b',
        scaffoldedHints: [
          'Recall Newton’s 2nd Law: Force = Mass × Acceleration (F = m × a).',
          'Rearrange the equation to solve for acceleration: a = F / m.',
          'Plug in F = 30 N and m = 10 kg.'
        ],
        choices: [
          { id: 'choice_a', text: '300 m/s²', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Multiplied force and mass (30 * 10).' },
          { id: 'choice_b', text: '3 m/s²' },
          { id: 'choice_c', text: '0.3 m/s²', misconceptionTag: 'MIS_ORDER_INVERSION', misconceptionDescription: 'Divided mass by force (10 / 30).' },
          { id: 'choice_d', text: '20 m/s²', misconceptionTag: 'MIS_RATIO_ADDITIVE_ERROR', misconceptionDescription: 'Subtracted mass from force (30 - 10).' }
        ]
      }
    ]
  }
};
