/**
 * Entity & Keyword Protection Module
 * Locks fixed scientific constructs, statistical notation, formulas, and citations
 * so that mechanical transformations never corrupt them.
 */

export interface ProtectedSpan {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'statistical' | 'scientific_construct' | 'citation' | 'proper_noun';
}

/**
 * Fixed multi-word scientific and research constructs that MUST NOT be mechanically altered
 */
export const FIXED_SCIENTIFIC_CONSTRUCTS: string[] = [
  // User Requested Key Domain Terms & Academic Expressions
  'systematic review',
  'systematic reviews',
  'systematic literature review',
  'literature review',
  'literature reviews',
  'scoping review',
  'scoping reviews',
  'meta-analysis',
  'meta-analyses',
  'social media use',
  'social media usage',
  'social-media-use',
  'frequency-based social-media-use',
  'problematic use',
  'problematic social media use',
  'problematic social-media-use',
  'internal consistency',
  'self-esteem questionnaire',
  'self esteem questionnaire',
  'self-esteem',
  'self esteem',
  'positively and negatively worded statements',
  'positively and negatively worded',
  'positively worded',
  'negatively worded',
  'social comparison',
  'social comparison theory',
  'social comparison framework',
  'time spent online',
  'forms of engagement',
  'forms of engagement and comparison',
  'university students',
  'college students',
  'undergraduate students',
  'tertiary students',
  'cross-sectional study',
  'cross-sectional design',
  'cross-sectional investigation',
  'mixed-methods',
  'mixed methods',
  'small-scale mixed-methods',
  'qualitative responses',
  'qualitative analysis',
  'quantitative analysis',
  'open-ended questions',
  'sample size',
  'sample sizes',
  'sample',
  'samples',
  'dataset',
  'datasets',
  'data set',
  'data sets',
  'data collection',
  'survey measure',
  'likert scale',
  'statistical significance',
  'statistically significant',
  'standard deviation',
  'longitudinal evidence',
  'longitudinal data',
  'longitudinal study',
  'longitudinal investigation',
  'verifying the analysis',
  'statistical analysis',
  'empirical findings',
  'primary findings',
  'key findings',
  'scientific evidence',
  'mean score',
  'mean scores',
  'correlation coefficient',
  'correlation coefficients',
  'regression analysis',
  'confidence interval',
  'confidence intervals',
  'inter-rater reliability',
  'cronbach\'s alpha',
  'cronbachs alpha',
  'spearman\'s rho',
  'spearmans rho',
  'pearson correlation',
  'pearson\'s r',
  'null hypothesis',
  'independent variable',
  'dependent variable',
  'control group',
  'experimental group',
  'mental health',
  'well-being',
  'well being',
  'correlated',
  'correlates',
  'correlation',
  'correlations',
];

/**
 * Statistical notations, variables, and formulas regex patterns
 * e.g. M = 31.41, SD = 7.78, p < .05, r = -0.14, rho = -.15, alpha = .81, t(28) = 1.45, F(2, 45) = 3.12, 95% CI [1.2, 3.4]
 */
export const STATISTICAL_REGEX = /\b([MSDprtFNz]|SD|SE|CI|df|p-value|alpha|rho|beta)\s*(=|<|>|≤|≥)\s*[-−]?(?:\d+(?:\.\d+)?|\.\d+)|\b\d+(?:\.\d+)?\s*%\b|\b(t|F|z)\s*\(\s*\d+\s*(?:,\s*\d+)?\s*\)\s*(=|<|>)\s*[-−]?(?:\d+(?:\.\d+)?|\.\d+)|\b\d+\s+respondents\b|\b\d+\s+participants\b|\b\d+\s+students\b|\b\d+\s+subjects\b|\b\d+\s+responses\b/gi;

/**
 * APA / Academic Citation Regex
 * e.g. (Smith et al., 2020), (Johnson, 2019; Williams & Brown, 2021), Festinger's (1954), etc.
 */
export const CITATION_REGEX = /\((?:[A-Z][A-Za-z\-]+(?:\s+et\s+al\.)?(?:,\s*\d{4}[a-z]?)?(?:;\s*)?)+\)|[A-Z][A-Za-z\-]+(?:'s)?\s*\(\d{4}[a-z]?\)/g;

/**
 * Parenthetical statistical reportings
 * e.g. (M = 31.41, SD = 7.78), (Cronbach's alpha = .81), (Spearman's rho = -.15, p = .442), (r = .35, p < .001)
 */
export const PARENTHETICAL_STATS_REGEX = /\([^)]*(?:M\s*=|SD\s*=|SE\s*=|p\s*[=<>≤≥]|r\s*=|F\s*\(|t\s*\(|alpha\s*=|rho\s*=|β\s*=|CI\b|df\s*=|R\^?2|d\s*=|η\s*=|z\s*=|Cronbach|Spearman|Pearson)[^)]*\)/gi;

/**
 * Strict Locker for Numbers, Statistical Expressions, Citations, and Multi-Word Constructs.
 * Replaces protected tokens with immutable placeholders before any processing/sanitizing,
 * guaranteeing 100% preservation of spacing, decimal points, and scientific terms.
 */
export function lockStatisticalAndAcademicExpressions(text: string): {
  lockedText: string;
  restore: (processedText: string) => string;
} {
  if (!text) {
    return { lockedText: '', restore: (t: string) => t };
  }

  const tokenMap = new Map<string, string>();
  let counter = 0;
  let currentText = text;

  const replaceWithToken = (match: string): string => {
    const token = `__PROT_LOCK_${counter++}__`;
    tokenMap.set(token, match);
    return token;
  };

  // 1. Lock Parenthetical Statistical Blocks first (e.g. (M = 31.41, SD = 7.78), (Cronbach's alpha = .81))
  currentText = currentText.replace(PARENTHETICAL_STATS_REGEX, replaceWithToken);

  // 2. Lock Citations with Authors & Years (e.g. (Festinger, 1954), Festinger's (1954))
  currentText = currentText.replace(CITATION_REGEX, replaceWithToken);

  // 3. Lock Multi-word Scientific and Methodological Constructs (e.g. "systematic review", "social media use")
  // Sort longest constructs first to avoid partial matches
  const sortedConstructs = [...FIXED_SCIENTIFIC_CONSTRUCTS].sort((a, b) => b.length - a.length);
  for (const construct of sortedConstructs) {
    const escaped = construct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    currentText = currentText.replace(regex, replaceWithToken);
  }

  // 4. Lock standalone statistical notations (e.g. M = 4.21, p = .442, rho = -.15)
  currentText = currentText.replace(STATISTICAL_REGEX, replaceWithToken);

  // 5. Lock decimal numbers and percentages so no punctuation regex can touch them (e.g. 31.41, 7.78, -.15, .81)
  currentText = currentText.replace(/[-−]?(?:\d+\.\d+|\.\d+)(?:\s*%)?/g, replaceWithToken);

  const restore = (processedText: string): string => {
    let restored = processedText;
    // Restore tokens in reverse order or map lookup
    tokenMap.forEach((originalValue, token) => {
      // Use global replacement for each token
      restored = restored.split(token).join(originalValue);
    });
    return restored;
  };

  return { lockedText: currentText, restore };
}

/**
 * Finds all protected spans in a sentence
 */
export function findProtectedSpans(sentence: string): ProtectedSpan[] {
  const spans: ProtectedSpan[] = [];

  // 1. Fixed Scientific Constructs (case-insensitive)
  FIXED_SCIENTIFIC_CONSTRUCTS.forEach((construct) => {
    const escaped = construct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sentence)) !== null) {
      spans.push({
        text: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        type: 'scientific_construct',
      });
    }
  });

  // 2. Statistical Notations
  let statMatch: RegExpExecArray | null;
  const statReg = new RegExp(STATISTICAL_REGEX.source, 'gi');
  while ((statMatch = statReg.exec(sentence)) !== null) {
    spans.push({
      text: statMatch[0],
      startIndex: statMatch.index,
      endIndex: statMatch.index + statMatch[0].length,
      type: 'statistical',
    });
  }

  // 3. Citations
  let citeMatch: RegExpExecArray | null;
  const citeReg = new RegExp(CITATION_REGEX.source, 'g');
  while ((citeMatch = citeReg.exec(sentence)) !== null) {
    spans.push({
      text: citeMatch[0],
      startIndex: citeMatch.index,
      endIndex: citeMatch.index + citeMatch[0].length,
      type: 'citation',
    });
  }

  // Sort by start index
  return spans.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Checks if a specific character range or word is protected
 */
export function isRangeProtected(
  startIndex: number,
  endIndex: number,
  spans: ProtectedSpan[]
): boolean {
  return spans.some(
    (span) => Math.max(startIndex, span.startIndex) < Math.min(endIndex, span.endIndex)
  );
}

/**
 * Standard scientific nouns and terms that must never be substituted with awkward thesaurus variants
 */
export const INVARIANT_SCIENTIFIC_WORDS = new Set([
  'analysis',
  'analyses',
  'evidence',
  'finding',
  'findings',
  'result',
  'results',
  'data',
  'dataset',
  'datasets',
  'questionnaire',
  'methodology',
  'method',
  'methods',
  'participant',
  'participants',
  'respondent',
  'respondents',
  'hypothesis',
  'hypotheses',
  'sample',
  'samples',
  'correlation',
  'correlations',
  'variable',
  'variables',
  'significance',
  'statistically',
  'longitudinal',
  'consistency',
  'reliability',
  'validity',
]);

/**
 * AI Cliches and contextually inappropriate thesaurus words that must NEVER be used as substitutions
 */
export const BANNED_UNNATURAL_SYNONYMS = new Set([
  'scrutiny',
  'scrutinize',
  'scrutinized',
  'scrutinizing',
  'documentation',
  'empirical observation',
  'empirical observations',
  'empirical outcomes',
  'appraise',
  'appraisal',
  'appraising',
  'appraised',
  'pronouncedly',
  'bolster',
  'bolsters',
  'bolstered',
  'bolstering',
  'inextricably',
  'inextricably linked',
  'undertook a structured examination of',
  'undertook a systematic examination of',
  'completed an appraisal of',
  'carried out an appraisal of',
  'ordered review',
  'deleterious',
  'testament',
  'testament to',
  'beacon',
  'tapestry',
  'delve',
]);

