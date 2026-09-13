/**
 * Sentence Validator & Structural Analyzer
 * 
 * Distinguishes proper sentences (subject + predicate/finite verb) from non-sentences:
 * - Section headings & titles (e.g., "1. Introduction", "Abstract", "Methodology")
 * - Words before a colon (e.g., "Note: ", "Hypothesis 1: ", "Figure 2: ")
 * - Non-sentences, noun phrases, and fragments without proper finite verbs
 */

import { tagSentence, POSTag } from './posTagger';

// Recognized section title keywords in academic and business documents
const KNOWN_SECTION_KEYWORDS = new Set([
  'abstract',
  'introduction',
  'background',
  'related work',
  'literature review',
  'methodology',
  'methods',
  'materials and methods',
  'participants',
  'procedure',
  'measures',
  'materials',
  'experimental setup',
  'results',
  'findings',
  'discussion',
  'general discussion',
  'conclusion',
  'conclusions',
  'future work',
  'limitations',
  'references',
  'bibliography',
  'appendix',
  'acknowledgements',
  'acknowledgments',
  'author contributions',
  'conflict of interest',
  'funding',
  'table of contents',
  'executive summary',
  'overview',
  'key findings',
  'study design',
  'statistical analysis',
  'data analysis',
  'hypotheses testing',
  'hypothesis testing',
  'demographics',
  'participant characteristics',
]);

// Auxiliaries and modals that establish a finite predicate
const FINITE_AUX_AND_MODALS = new Set([
  'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'have', 'has', 'had',
  'do', 'does', 'did',
  'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would',
]);

// Core finite verbs frequently used in academic, scientific, and general writing
const KNOWN_FINITE_VERBS = new Set([
  // Present & 3rd person singular
  'demonstrate', 'demonstrates', 'demonstrated',
  'indicate', 'indicates', 'indicated',
  'suggest', 'suggests', 'suggested',
  'reveal', 'reveals', 'revealed',
  'show', 'shows', 'showed', 'shown',
  'find', 'finds', 'found',
  'observe', 'observes', 'observed',
  'report', 'reports', 'reported',
  'examine', 'examines', 'examined',
  'analyze', 'analyzes', 'analyzed', 'analyse', 'analyses', 'analysed',
  'investigate', 'investigates', 'investigated',
  'explore', 'explores', 'explored',
  'evaluate', 'evaluates', 'evaluated',
  'assess', 'assesses', 'assessed',
  'measure', 'measures', 'measured',
  'collect', 'collects', 'collected',
  'identify', 'identifies', 'identified',
  'note', 'notes', 'noted',
  'conclude', 'concludes', 'concluded',
  'confirm', 'confirms', 'confirmed',
  'establish', 'establishes', 'established',
  'provide', 'provides', 'provided',
  'yield', 'yields', 'yielded',
  'reflect', 'reflects', 'reflected',
  'exhibit', 'exhibits', 'exhibited',
  'correlate', 'correlates', 'correlated',
  'predict', 'predicts', 'predicted',
  'increase', 'increases', 'increased',
  'decrease', 'decreases', 'decreased',
  'reduce', 'reduces', 'reduced',
  'vary', 'varies', 'varied',
  'influence', 'influences', 'influenced',
  'affect', 'affects', 'affected',
  'mediate', 'mediates', 'mediated',
  'moderate', 'moderates', 'moderated',
  'account', 'accounts', 'accounted',
  'differ', 'differs', 'differed',
  'compare', 'compares', 'compared',
  'control', 'controls', 'controlled',
  'conduct', 'conducts', 'conducted',
  'perform', 'performs', 'performed',
  'complete', 'completes', 'completed',
  'include', 'includes', 'included',
  'contain', 'contains', 'contained',
  'require', 'requires', 'required',
  'involve', 'involves', 'involved',
  'represent', 'represents', 'represented',
  'consist', 'consists', 'consisted',
  'serve', 'serves', 'served',
  'lead', 'leads', 'led',
  'cause', 'causes', 'caused',
  'result', 'results', 'resulted',
  'allow', 'allows', 'allowed',
  'enable', 'enables', 'enabled',
  'help', 'helps', 'helped',
  'support', 'supports', 'supported',
  'stand', 'stands', 'stood',
  'play', 'plays', 'played',
  'make', 'makes', 'made',
  'take', 'takes', 'took', 'taken',
  'give', 'gives', 'gave', 'given',
  'see', 'sees', 'saw', 'seen',
  'know', 'knows', 'knew', 'known',
  'think', 'thinks', 'thought',
  'come', 'comes', 'came',
  'go', 'goes', 'went', 'gone',
  'become', 'becomes', 'became',
  'bring', 'brings', 'brought',
  'begin', 'begins', 'began', 'begun',
  'keep', 'keeps', 'kept',
  'hold', 'holds', 'held',
  'write', 'writes', 'wrote', 'written',
  'occur', 'occurs', 'occurred',
  'exist', 'exists', 'existed',
  'remain', 'remains', 'remained',
  'appear', 'appears', 'appeared',
  'seem', 'seems', 'seemed',
  'tend', 'tends', 'tended',
  'apply', 'applies', 'applied',
  'employ', 'employs', 'employed',
  'utilize', 'utilizes', 'utilized',
  'leverage', 'leverages', 'leveraged',
  'spearhead', 'spearheads', 'spearheaded',
  'enhance', 'enhances', 'enhanced',
  'streamline', 'streamlines', 'streamlined',
  'audit', 'audits', 'audited',
  'review', 'reviews', 'reviewed',
  'embark', 'embarks', 'embarked',
  'achieve', 'achieves', 'achieved',
  'undergo', 'undergoes', 'underwent', 'undergone',
  'determine', 'determines', 'determined',
  'maintain', 'maintains', 'maintained',
  'highlight', 'highlights', 'highlighted',
  'underscore', 'underscores', 'underscored',
]);

// Subject pronouns
const SUBJECT_PRONOUNS = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'who',
  'someone', 'everyone', 'anyone', 'nobody',
  'this', 'that', 'these', 'those', 'there',
]);

// Determiners that introduce a subject noun phrase
const DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'each', 'every', 'some', 'all', 'both', 'no',
  'our', 'their', 'its', 'my', 'your', 'such',
]);

// Common subject nouns in research and academic texts
const COMMON_SUBJECT_NOUNS = new Set([
  'study', 'studies', 'research', 'analysis', 'analyses', 'investigation', 'investigations',
  'finding', 'findings', 'result', 'results', 'data', 'dataset', 'datasets',
  'sample', 'samples', 'participant', 'participants', 'student', 'students',
  'model', 'models', 'algorithm', 'algorithms', 'author', 'authors',
  'researcher', 'researchers', 'paper', 'papers', 'experiment', 'experiments',
  'method', 'methods', 'system', 'systems', 'approach', 'approaches',
  'framework', 'frameworks', 'hypothesis', 'hypotheses', 'survey', 'surveys',
  'score', 'scores', 'response', 'responses', 'cohort', 'cohorts',
  'variance', 'factor', 'factors', 'correlation', 'correlations',
  'relationship', 'relationships', 'difference', 'differences', 'evidence',
  'variable', 'variables', 'effect', 'effects', 'group', 'groups',
  'team', 'teams', 'work', 'literature', 'theory', 'theories',
]);

/**
 * Checks if a string is a section heading, title, or caption
 */
export function isSectionHeading(text: string, isHeadingProp?: boolean): boolean {
  if (isHeadingProp) return true;
  const trimmed = text.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase().replace(/[:.]\s*$/, '');

  // 1. Exact match with known academic / report section headings
  if (KNOWN_SECTION_KEYWORDS.has(lower)) {
    return true;
  }

  // 2. Numbered section heading (e.g., "1. Introduction", "2.1 Background", "Section 3: Methodology", "Chapter 4")
  if (/^(\d+(\.\d+)*|[A-Z]\.?|\b(?:section|chapter|appendix|part)\s+\d+[:.]?)\s+[A-Za-z0-9]/i.test(trimmed)) {
    // If it's short or lacks sentence-ending punctuation, it's a section heading
    if (trimmed.split(/\s+/).length <= 10 && !/[.!?]$/.test(trimmed)) {
      return true;
    }
  }

  // 3. Table / Figure / Scheme captions (e.g., "Table 1: Participant Demographics", "Figure 2. Results overview")
  if (/^(?:table|figure|fig\.|chart|scheme|box|plate)\s+\d+[:.]?/i.test(trimmed)) {
    return true;
  }

  // 4. Short title-case or uppercase lines without sentence punctuation
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 1 && words.length <= 8) {
    // Ends with colon -> heading or label
    if (trimmed.endsWith(':')) return true;

    // No terminal sentence punctuation (. ! ?)
    if (!/[.!?]$/.test(trimmed)) {
      const isTitleCase = words.every((w) => /^[A-Z0-9]/.test(w) || ['of', 'and', 'in', 'on', 'at', 'to', 'for', 'with', 'the', 'a', 'an'].includes(w.toLowerCase()));
      const isAllUpper = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
      if (isTitleCase || isAllUpper) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Detects and extracts a leading label prefix before a colon
 * e.g., "Note: The participants were recruited..." -> { hasPrefix: true, prefix: "Note:", remainder: "The participants were recruited..." }
 * "Hypothesis 1: Students with high usage exhibit..." -> { hasPrefix: true, prefix: "Hypothesis 1:", remainder: "..." }
 */
export function extractLabelPrefix(text: string): {
  hasPrefix: boolean;
  prefix: string;
  remainder: string;
} {
  const trimmed = text.trim();
  // Match prefix up to first colon, provided the prefix looks like a label (1 to 4 words, <= 45 chars)
  const colonMatch = trimmed.match(/^([A-Za-z0-9\s\-–—()]{1,45}):(?:\s+(.*)|\s*$)/);

  if (!colonMatch) {
    return { hasPrefix: false, prefix: '', remainder: trimmed };
  }

  const labelCandidate = colonMatch[1].trim();
  const labelWords = labelCandidate.split(/\s+/);

  // Labels before colon are typically 1-4 words: "Note", "Hypothesis 1", "Figure 2", "Key finding", "Author Note", "Limitation"
  const isRecognizedLabel =
    labelWords.length <= 4 &&
    !labelWords.some((w) => FINITE_AUX_AND_MODALS.has(w.toLowerCase()));

  if (isRecognizedLabel) {
    return {
      hasPrefix: true,
      prefix: `${labelCandidate}:`,
      remainder: (colonMatch[2] || '').trim(),
    };
  }

  return { hasPrefix: false, prefix: '', remainder: trimmed };
}

/**
 * Checks if a text token is a finite verb form
 */
export function isFiniteVerb(cleanWord: string, prevWord?: string): boolean {
  const w = cleanWord.toLowerCase();

  // Modals & Auxiliaries
  if (FINITE_AUX_AND_MODALS.has(w)) return true;

  // Known finite verb lexicon
  if (KNOWN_FINITE_VERBS.has(w)) return true;

  // Preceded by auxiliary or modal: "can observe", "will show", "was measured"
  if (prevWord && FINITE_AUX_AND_MODALS.has(prevWord.toLowerCase())) {
    return true;
  }

  // Common finite verb morphological endings
  if (w.endsWith('ize') || w.endsWith('izes') || w.endsWith('ized') ||
      w.endsWith('ise') || w.endsWith('ises') || w.endsWith('ised') ||
      w.endsWith('ify') || w.endsWith('ifies') || w.endsWith('ified')) {
    return true;
  }

  // -ate / -ates / -ated verbs (excluding frequent non-verb nouns/adjectives)
  if ((w.endsWith('ate') || w.endsWith('ates') || w.endsWith('ated')) &&
      !['state', 'states', 'rate', 'rates', 'date', 'dates', 'climate', 'certificate', 'candidate', 'deliberate', 'private'].includes(w)) {
    return true;
  }

  // Regular past tense -ed (minimum 4 letters)
  if (w.endsWith('ed') && w.length >= 4 &&
      !['red', 'bed', 'tired', 'sophisticated', 'unprecedented', 'advanced', 'unexpected', 'limited', 'related'].includes(w)) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether a string is a complete grammatical sentence
 * with a valid subject and finite predicate/verb.
 */
export function isProperSentence(text: string): {
  isProper: boolean;
  reason?: string;
  hasSubject: boolean;
  hasFiniteVerb: boolean;
} {
  const trimmed = text.trim();

  // Empty or tiny strings
  if (!trimmed) {
    return { isProper: false, reason: 'Empty text', hasSubject: false, hasFiniteVerb: false };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);

  // Non-sentences: fewer than 3 words (rarely a complete grammatical clause in English)
  if (words.length < 3) {
    return {
      isProper: false,
      reason: 'Fewer than 3 words (fragment or heading)',
      hasSubject: false,
      hasFiniteVerb: false,
    };
  }

  // Numeric, mathematical, or citation fragment: (e.g. "r = -0.34, p < .01.", "N = 380, M = 4.2.")
  const alphabeticChars = trimmed.replace(/[^a-zA-Z]/g, '');
  if (alphabeticChars.length < 4) {
    return {
      isProper: false,
      reason: 'Numeric, mathematical, or statistical fragment',
      hasSubject: false,
      hasFiniteVerb: false,
    };
  }

  // Pure citation line: "(Smith et al., 2020; Johnson, 2019)."
  if (/^\([A-Za-z\s,.\d;&-]+\)[.]?$/.test(trimmed)) {
    return {
      isProper: false,
      reason: 'Citation fragment without clause',
      hasSubject: false,
      hasFiniteVerb: false,
    };
  }

  // Analyze tokens for Subject & Finite Verb
  let hasSubject = false;
  let hasFiniteVerb = false;

  const cleanWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9'-]/g, ''));

  for (let i = 0; i < cleanWords.length; i++) {
    const cw = cleanWords[i];
    const prevCw = i > 0 ? cleanWords[i - 1] : undefined;

    // Check for Subject
    if (!hasSubject) {
      if (SUBJECT_PRONOUNS.has(cw)) {
        hasSubject = true;
      } else if (COMMON_SUBJECT_NOUNS.has(cw)) {
        hasSubject = true;
      } else if (DETERMINERS.has(cw)) {
        // "the study", "a sample", "this analysis" introduces subject noun phrase
        hasSubject = true;
      } else if (i === 0 && (cw.endsWith('ing') || /^[A-Z][a-z]+/.test(words[0]))) {
        // Gerund subject or initial proper noun / capitalized noun
        hasSubject = true;
      }
    }

    // Check for Finite Verb / Predicate
    if (!hasFiniteVerb) {
      if (isFiniteVerb(cw, prevCw)) {
        hasFiniteVerb = true;
      }
    }

    // If both found, early exit
    if (hasSubject && hasFiniteVerb) {
      break;
    }
  }

  // Secondary confirmation using context-aware POS tagger if initial heuristics are uncertain
  if (!hasFiniteVerb) {
    const tagged = tagSentence(trimmed);
    const verbTokens = tagged.filter((t) => t.tag === 'VERB');
    if (verbTokens.length > 0) {
      hasFiniteVerb = true;
    }
  }

  if (!hasSubject) {
    // If finite verb is present and sentence starts with an imperative or expletive, grant subject
    if (hasFiniteVerb && words.length >= 4) {
      hasSubject = true;
    }
  }

  const isProper = hasSubject && hasFiniteVerb;

  return {
    isProper,
    reason: isProper
      ? 'Proper sentence with subject and predicate'
      : !hasFiniteVerb
      ? 'Lacks finite verb / predicate (fragment or title)'
      : 'Lacks grammatical subject',
    hasSubject,
    hasFiniteVerb,
  };
}

/**
 * Comprehensive analysis of a text chunk to decide if and how it should be paraphrased
 */
export function analyzeSentenceForParaphrasing(
  rawText: string,
  isHeadingProp?: boolean
): {
  shouldParaphrase: boolean;
  prefixToKeep: string;
  coreSentenceToParaphrase: string;
  reason: string;
  isProperSentence: boolean;
} {
  const trimmed = rawText.trim();

  // 1. Check if it's a section heading / title
  if (isSectionHeading(trimmed, isHeadingProp)) {
    return {
      shouldParaphrase: false,
      prefixToKeep: '',
      coreSentenceToParaphrase: trimmed,
      reason: 'Section heading or title (preserved verbatim)',
      isProperSentence: false,
    };
  }

  // 2. Check for words before a colon (e.g. "Note: ...", "Hypothesis 1: ...")
  const { hasPrefix, prefix, remainder } = extractLabelPrefix(trimmed);

  if (hasPrefix) {
    // If remainder is empty, it's just a label line like "Methods:" or "Note:"
    if (!remainder) {
      return {
        shouldParaphrase: false,
        prefixToKeep: '',
        coreSentenceToParaphrase: trimmed,
        reason: 'Section label / words before colon (preserved verbatim)',
        isProperSentence: false,
      };
    }

    // Validate if the remainder after the colon is a proper sentence
    const remainderValidation = isProperSentence(remainder);
    if (!remainderValidation.isProper) {
      return {
        shouldParaphrase: false,
        prefixToKeep: '',
        coreSentenceToParaphrase: trimmed,
        reason: `Words before colon with fragment: ${remainderValidation.reason}`,
        isProperSentence: false,
      };
    }

    // Proper sentence after colon: preserve label prefix, paraphrase only remainder!
    return {
      shouldParaphrase: true,
      prefixToKeep: prefix,
      coreSentenceToParaphrase: remainder,
      reason: 'Paraphrase clause after preserved colon label',
      isProperSentence: true,
    };
  }

  // 3. Regular sentence validation
  const validation = isProperSentence(trimmed);

  if (!validation.isProper) {
    return {
      shouldParaphrase: false,
      prefixToKeep: '',
      coreSentenceToParaphrase: trimmed,
      reason: validation.reason || 'Non-sentence or fragment (preserved verbatim)',
      isProperSentence: false,
    };
  }

  return {
    shouldParaphrase: true,
    prefixToKeep: '',
    coreSentenceToParaphrase: trimmed,
    reason: 'Proper grammatical sentence with subject and predicate',
    isProperSentence: true,
  };
}
