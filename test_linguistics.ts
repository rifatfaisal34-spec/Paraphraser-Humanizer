import { paraphraseSentence } from './src/nlp/paraphraserEngine';
import { sanitizePunctuationSpacing } from './src/nlp/sanitizer';
import { ParaphraseConfig, DEFAULT_CONFIG } from './src/types';

console.log('--- Testing Linguistic Rules & Invariant Vocabulary ---');

const testCases = [
  {
    name: 'Preserve "verifying the analysis"',
    text: 'Researchers emphasized the importance of verifying the analysis before publishing.',
  },
  {
    name: 'Preserve "Longitudinal evidence"',
    text: 'Longitudinal evidence indicates that passive consumption correlates with negative outcomes.',
  },
  {
    name: 'Preserve "findings"',
    text: 'The findings of this study provide clear insights into student behavior.',
  },
  {
    name: 'Clean Punctuation with verbal bridge',
    text: "Self-esteem is, generally conceptualized as, a person's evaluation of their self-worth.",
  },
  {
    name: 'Syntactic Clause Transformation with "because"',
    text: 'Social comparison is especially important because users can rapidly compare their appearance, achievements, relationships, and lifestyles.',
  },
  {
    name: 'Prevent passive scrambling on study questionnaire',
    text: 'The present study used a 10-item self-esteem questionnaire containing positively and negatively worded statements.',
  },
  {
    name: 'Preserve statistical notation',
    text: 'The sample had a mean score (M = 31.41, SD = 7.78, p < .05, r = -0.14).',
  }
];

const config: ParaphraseConfig = {
  ...DEFAULT_CONFIG,
  tone: 'academic',
  engine: 'rule_based',
  reorderClauses: true,
  changeWordClass: true,
  voice: 'keep',
  preserveTechnicalTerms: true,
};

let allPassed = true;

for (let i = 0; i < testCases.length; i++) {
  const tc = testCases[i];
  console.log(`\nTest: ${tc.name}`);
  console.log(`Original: "${tc.text}"`);

  // Test sanitizer first on verbal bridge
  const sanitizedDirect = sanitizePunctuationSpacing(tc.text);
  console.log(`Sanitized: "${sanitizedDirect}"`);

  // Test sentence paraphraser
  const result = paraphraseSentence(tc.text, config, 0, i, testCases.length, false);
  console.log(`Paraphrased: "${result.paraphrasedText}"`);
  console.log(`Techniques: ${result.techniques.join(', ')}`);
  console.log(`Explanations: ${result.rulesExplanation.join(' | ')}`);

  // Assertions
  const lowerPara = result.paraphrasedText.toLowerCase();

  if (tc.name.includes('analysis') && lowerPara.includes('scrutiny')) {
    console.error('FAIL: Found "scrutiny" instead of analysis!');
    allPassed = false;
  }
  if (tc.name.includes('evidence') && lowerPara.includes('documentation')) {
    console.error('FAIL: Found "documentation" instead of evidence!');
    allPassed = false;
  }
  if (tc.name.includes('findings') && lowerPara.includes('empirical observation')) {
    console.error('FAIL: Found "empirical observation" instead of findings!');
    allPassed = false;
  }
  if (lowerPara.includes('as, a') || lowerPara.includes('as, the')) {
    console.error('FAIL: Found misplaced comma "as, a"!');
    allPassed = false;
  }
  if (lowerPara.includes('are presented by the')) {
    console.error('FAIL: Found dangling passive fragment "are presented by the"!');
    allPassed = false;
  }
  if (tc.name.includes('statistical notation') && !result.paraphrasedText.includes('M = 31.41, SD = 7.78, p < .05, r = -0.14')) {
    console.error('FAIL: Statistical notation corrupted!');
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n>>> ALL LINGUISTIC TESTS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('\n>>> SOME TESTS FAILED! <<<');
  process.exit(1);
}
