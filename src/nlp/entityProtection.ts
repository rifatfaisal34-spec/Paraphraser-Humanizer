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
  // User Requested Key Domain Terms
  'university students',
  'college students',
  'undergraduate students',
  'sample',
  'samples',
  'sample size',
  'dataset',
  'datasets',
  'data set',
  'data sets',
  'correlated',
  'correlates',
  'correlation',
  'correlations',
  'social media use',
  'social media usage',
  'social-media-use',
  'frequency-based social-media-use',
  'self-esteem',
  'self esteem',
  'data collection',
  'open-ended questions',
  'qualitative responses',
  'quantitative analysis',
  'survey measure',
  'likert scale',
  'statistical significance',
  'mental health',
  'well-being',
  'well being',
  'standard deviation',
  'mean score',
  'correlation coefficient',
  'regression analysis',
  'confidence interval',
  'inter-rater reliability',
  'cronbach\'s alpha',
  'cronbachs alpha',
  'spearman\'s rho',
  'spearmans rho',
  'pearson correlation',
  'null hypothesis',
  'independent variable',
  'dependent variable',
  'control group',
  'experimental group',
];

/**
 * Statistical notations, variables, and formulas regex patterns
 * e.g. M = 4.21, SD = 0.85, p < .05, r = -0.14, ρ = 0.22, α = .88, t(28) = 1.45, F(2, 45) = 3.12, 95% CI [1.2, 3.4]
 */
export const STATISTICAL_REGEX = /\b([MSDprtFNz]|SD|SE|CI|df|p-value|alpha|rho|alpha|beta)\s*(=|<|>|≤|≥)\s*[-−]?\d+(\.\d+)?|\b\d+(\.\d+)?\s*%\b|\b(t|F|z)\s*\(\s*\d+\s*(?:,\s*\d+)?\s*\)\s*(=|<|>)\s*[-−]?\d+(\.\d+)?|\b\d+\s+respondents\b|\b\d+\s+participants\b|\b\d+\s+students\b|\b\d+\s+subjects\b|\b\d+\s+responses\b/gi;

/**
 * APA / Academic Citation Regex
 * e.g. (Smith et al., 2020), (Johnson, 2019; Williams & Brown, 2021), etc.
 */
export const CITATION_REGEX = /\((?:[A-Z][A-Za-z\-]+(?:\s+et\s+al\.)?(?:,\s*\d{4})?(?:;\s*)?)+\)/g;

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
