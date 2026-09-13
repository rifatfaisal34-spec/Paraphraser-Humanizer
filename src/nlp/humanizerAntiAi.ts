/**
 * Anti-AI Humanization & Burstiness Engine
 * 
 * Fusion module combining deterministic linguistic rules and AI to bypass AI detectors (GPTZero, Turnitin, Copyleaks, etc.)
 * 
 * Key Pillars:
 * 1. Vary Sentence Architecture (High Burstiness): Dynamically blends short punchy sentences with long multi-clause syntax.
 * 2. Abstractive Paragraph Synthesis: Semantic reconstruction rather than mechanical line-by-line synonym replacement.
 * 3. Domain Terminology Preservation: Methodological invariant locking ("sample", "dataset", "correlated", "university students").
 * 4. Anti-AI Vocabulary Sanitization: Strips and replaces notorious AI clichés ("delve", "crucial", "pivotal", "testament", "fostering", etc.)
 */

import { ToneStyle } from '../types';

/**
 * AI "Tell" Cliché Words and their direct, natural human replacements.
 * AI models exhibit extreme statistical bias toward these flowery transitional terms.
 */
export const AI_VOCABULARY_MAP: Record<string, { replacements: string[]; pattern: RegExp }> = {
  'delve into': {
    replacements: ['examine', 'explore', 'look into', 'investigate', 'study'],
    pattern: /\bdelve\s+into\b/gi,
  },
  'delve deeper into': {
    replacements: ['examine further', 'look closer at', 'explore further'],
    pattern: /\bdelve\s+deeper\s+into\b/gi,
  },
  'delve': {
    replacements: ['examine', 'investigate', 'explore', 'study'],
    pattern: /\bdelve\b/gi,
  },
  'testament to': {
    replacements: ['evidence of', 'sign of', 'proof of', 'demonstration of'],
    pattern: /\b(?:a\s+)?testament\s+to\b/gi,
  },
  'testament': {
    replacements: ['evidence', 'proof', 'sign', 'indication'],
    pattern: /\btestament\b/gi,
  },
  'pivotal role': {
    replacements: ['key role', 'central role', 'major role', 'main role'],
    pattern: /\b(?:a\s+)?pivotal\s+role\b/gi,
  },
  'pivotal': {
    replacements: ['key', 'central', 'critical', 'important', 'major'],
    pattern: /\bpivotal\b/gi,
  },
  'crucial': {
    replacements: ['key', 'essential', 'important', 'vital', 'necessary'],
    pattern: /\bcrucial\b/gi,
  },
  'fostering': {
    replacements: ['encouraging', 'building', 'promoting', 'supporting', 'creating'],
    pattern: /\bfostering\b/gi,
  },
  'foster': {
    replacements: ['encourage', 'build', 'support', 'promote', 'develop'],
    pattern: /\bfoster\b/gi,
  },
  'fosters': {
    replacements: ['encourages', 'builds', 'supports', 'promotes', 'develops'],
    pattern: /\bfosters\b/gi,
  },
  'fostered': {
    replacements: ['encouraged', 'built', 'supported', 'promoted'],
    pattern: /\bfostered\b/gi,
  },
  'furthermore': {
    replacements: ['also', 'in addition', 'and', 'secondly', ''],
    pattern: /\bfurthermore,?\b/gi,
  },
  'moreover': {
    replacements: ['also', 'in addition', 'additionally', 'and', ''],
    pattern: /\bmoreover,?\b/gi,
  },
  'rich tapestry': {
    replacements: ['complex mix', 'broad range', 'combination', 'diversity'],
    pattern: /\b(?:a\s+)?rich\s+tapestry(?:\s+of)?\b/gi,
  },
  'tapestry': {
    replacements: ['mix', 'blend', 'combination', 'collection'],
    pattern: /\btapestry\b/gi,
  },
  'vibrant': {
    replacements: ['active', 'lively', 'strong', 'busy'],
    pattern: /\bvibrant\b/gi,
  },
  'beacon': {
    replacements: ['guide', 'model', 'standard', 'example'],
    pattern: /\bbeacon\b/gi,
  },
  'paramount': {
    replacements: ['top priority', 'essential', 'chief', 'primary', 'vital'],
    pattern: /\bparamount\b/gi,
  },
  'multifaceted': {
    replacements: ['complex', 'varied', 'diverse', 'broad'],
    pattern: /\bmultifaceted\b/gi,
  },
  'underscored': {
    replacements: ['highlighted', 'emphasized', 'stressed', 'showed'],
    pattern: /\bunderscored\b/gi,
  },
  'underscore': {
    replacements: ['highlight', 'emphasize', 'stress', 'show'],
    pattern: /\bunderscore\b/gi,
  },
  'underscores': {
    replacements: ['highlights', 'emphasizes', 'stresses', 'shows'],
    pattern: /\bunderscores\b/gi,
  },
  'navigating': {
    replacements: ['handling', 'managing', 'addressing', 'working through'],
    pattern: /\bnavigating\b/gi,
  },
  'navigate': {
    replacements: ['handle', 'manage', 'address', 'deal with'],
    pattern: /\bnavigate\b/gi,
  },
  'ever-evolving landscape': {
    replacements: ['changing environment', 'evolving field', 'current context'],
    pattern: /\b(?:an?\s+)?ever-evolving\s+landscape\b/gi,
  },
  'ever-evolving': {
    replacements: ['changing', 'evolving', 'developing'],
    pattern: /\bever-evolving\b/gi,
  },
  'dynamic landscape': {
    replacements: ['active environment', 'changing market', 'field'],
    pattern: /\b(?:the|a)\s+dynamic\s+landscape\b/gi,
  },
  'harness': {
    replacements: ['use', 'apply', 'draw on', 'leverage'],
    pattern: /\bharness\b/gi,
  },
  'harnessing': {
    replacements: ['using', 'applying', 'drawing on', 'employing'],
    pattern: /\bharnessing\b/gi,
  },
  'meticulously': {
    replacements: ['carefully', 'thoroughly', 'closely', 'in detail'],
    pattern: /\bmeticulously\b/gi,
  },
  'intricate interplay': {
    replacements: ['close relationship', 'complex interaction', 'connection'],
    pattern: /\b(?:the|an?)\s+intricate\s+interplay\b/gi,
  },
  'interplay': {
    replacements: ['interaction', 'relationship', 'connection', 'balance'],
    pattern: /\binterplay\b/gi,
  },
  'resonate with': {
    replacements: ['align with', 'appeal to', 'fit with'],
    pattern: /\bresonate(?:s)?\s+with\b/gi,
  },
  'catalyst for': {
    replacements: ['trigger for', 'driver of', 'spark for'],
    pattern: /\b(?:a\s+)?catalyst\s+for\b/gi,
  },
  'catalyst': {
    replacements: ['trigger', 'driver', 'spark', 'cause'],
    pattern: /\bcatalyst\b/gi,
  },
  'embark on': {
    replacements: ['begin', 'start', 'undertake', 'launch'],
    pattern: /\bembark\s+(?:on|upon)\b/gi,
  },
  'shed light on': {
    replacements: ['clarify', 'explain', 'reveal', 'highlight'],
    pattern: /\bshed(?:s)?\s+light\s+on\b/gi,
  },
  'it is important to note that': {
    replacements: ['notably,', 'specifically,', 'in particular,'],
    pattern: /\bit\s+is\s+important\s+to\s+note\s+that\b/gi,
  },
  'it is worth noting that': {
    replacements: ['notably,', 'importantly,'],
    pattern: /\bit\s+is\s+worth\s+noting\s+that\b/gi,
  },
  'seamlessly': {
    replacements: ['smoothly', 'easily', 'directly', 'naturally'],
    pattern: /\bseamlessly\b/gi,
  },
  'commendable': {
    replacements: ['effective', 'noteworthy', 'solid', 'strong'],
    pattern: /\bcommendable\b/gi,
  },
  'in conclusion': {
    replacements: ['overall,', 'in summary,', 'ultimately,'],
    pattern: /\bin\s+conclusion,?\b/gi,
  },
  'spearhead': {
    replacements: ['lead', 'direct', 'guide', 'initiate'],
    pattern: /\bspearhead(?:s|ed|ing)?\b/gi,
  },
  'holistic approach': {
    replacements: ['comprehensive approach', 'broad method', 'integrated method'],
    pattern: /\b(?:a\s+)?holistic\s+approach\b/gi,
  },
  'myriad of': {
    replacements: ['many', 'numerous', 'various', 'wide range of'],
    pattern: /\b(?:a\s+)?myriad\s+of\b/gi,
  },
  'plethora of': {
    replacements: ['abundance of', 'large number of', 'many'],
    pattern: /\b(?:a\s+)?plethora\s+of\b/gi,
  },
};

/**
 * Domain & Methodological Terms that MUST be strictly preserved without synonym swapping.
 * The user explicitly identified: "sample", "dataset", "correlated", "university students".
 */
export const INVARIANT_DOMAIN_TERMS = [
  'sample',
  'samples',
  'sample size',
  'dataset',
  'datasets',
  'data set',
  'data sets',
  'correlated',
  'correlate',
  'correlates',
  'correlation',
  'correlations',
  'university students',
  'college students',
  'undergraduate students',
  'participants',
  'respondents',
  'survey respondents',
  'statistically significant',
  'statistical significance',
  'p-value',
  'p-values',
  'regression',
  'regression analysis',
  'independent variable',
  'dependent variable',
  'control group',
  'experimental group',
  'mean',
  'median',
  'standard deviation',
  'survey',
  'survey measure',
  'likert scale',
  'methodology',
  'data collection',
  'open-ended questions',
  'qualitative responses',
  'quantitative analysis',
  'self-esteem',
  'social media use',
  'social media usage',
];

export interface SanitizedCliché {
  originalWord: string;
  replacedWith: string;
  index: number;
}

/**
 * Strips AI tell vocabulary and replaces it with direct, authentic human terms
 */
export function sanitizeAiVocabulary(text: string): {
  cleanedText: string;
  replacedCount: number;
  clichés: SanitizedCliché[];
} {
  let cleanedText = text;
  const clichés: SanitizedCliché[] = [];
  let replacedCount = 0;

  // Process longer multi-word phrases first, then single words
  const sortedEntries = Object.entries(AI_VOCABULARY_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [key, config] of sortedEntries) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(config.pattern.source, 'gi');

    while ((match = regex.exec(cleanedText)) !== null) {
      const originalMatched = match[0];
      const matchIndex = match.index;

      // Select replacement
      let replacement = config.replacements[0] || '';

      // Match capitalization of original
      if (originalMatched[0] === originalMatched[0].toUpperCase() && replacement.length > 0) {
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }

      // If replacement is empty (e.g. removing repetitive "Furthermore,"), clean surrounding space/comma
      if (!replacement) {
        cleanedText =
          cleanedText.slice(0, matchIndex) +
          cleanedText.slice(matchIndex + originalMatched.length).replace(/^\s*,?\s*/, ' ');
      } else {
        cleanedText =
          cleanedText.slice(0, matchIndex) +
          replacement +
          cleanedText.slice(matchIndex + originalMatched.length);
      }

      clichés.push({
        originalWord: originalMatched,
        replacedWith: replacement || '(removed flowery transition)',
        index: matchIndex,
      });
      replacedCount++;

      // Reset regex index for safety
      regex.lastIndex = matchIndex + replacement.length;
    }
  }

  // Clean up any double spaces or dangling commas produced by removals
  cleanedText = cleanedText
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
    .replace(/^\s*,\s*/gm, '');

  return { cleanedText, replacedCount, clichés };
}

/**
 * Burstiness Metrics Result
 */
export interface BurstinessResult {
  score: number; // 0 - 100 scaled index
  stdDev: number; // standard deviation of sentence word counts
  meanLength: number; // average sentence word count
  sentenceLengths: number[];
  rating: 'High (Human-like)' | 'Moderate' | 'Low (AI Uniform)';
  uniformRunDetected: boolean;
}

/**
 * Calculates sentence length variation (Burstiness).
 * AI text is notorious for having very low standard deviation (uniform 14-16 words per sentence).
 * Human writing has high burstiness (alternating short 5-word sentences with 25+ word compound sentences).
 */
export function calculateBurstiness(sentenceTexts: string[]): BurstinessResult {
  const lengths = sentenceTexts
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((len) => len > 0);

  if (lengths.length < 2) {
    return {
      score: 75,
      stdDev: 6.0,
      meanLength: lengths[0] || 15,
      sentenceLengths: lengths,
      rating: 'Moderate',
      uniformRunDetected: false,
    };
  }

  const sum = lengths.reduce((acc, val) => acc + val, 0);
  const meanLength = sum / lengths.length;

  const variance =
    lengths.reduce((acc, val) => acc + Math.pow(val - meanLength, 2), 0) /
    lengths.length;
  const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  // Detect if there is a robotic run of 3+ consecutive sentences with identical or ±2 words
  let uniformRunDetected = false;
  for (let i = 0; i < lengths.length - 2; i++) {
    const a = lengths[i];
    const b = lengths[i + 1];
    const c = lengths[i + 2];
    if (Math.abs(a - b) <= 2 && Math.abs(b - c) <= 2 && Math.abs(a - c) <= 3) {
      uniformRunDetected = true;
      break;
    }
  }

  // Calculate Burstiness Score (0 to 100)
  // Standard deviation of 8+ words is characteristic of high human burstiness
  let score = Math.min(100, Math.round((stdDev / 8.5) * 85));
  if (!uniformRunDetected && stdDev >= 6.5) {
    score = Math.min(99, score + 12);
  }
  if (uniformRunDetected && stdDev < 4.5) {
    score = Math.max(25, score - 20);
  }

  let rating: 'High (Human-like)' | 'Moderate' | 'Low (AI Uniform)' = 'Moderate';
  if (stdDev >= 6.8 && !uniformRunDetected) {
    rating = 'High (Human-like)';
  } else if (stdDev < 4.2 || uniformRunDetected) {
    rating = 'Low (AI Uniform)';
  }

  return {
    score,
    stdDev,
    meanLength: Math.round(meanLength * 10) / 10,
    sentenceLengths: lengths,
    rating,
    uniformRunDetected,
  };
}

/**
 * Enforces High Burstiness on a list of sentences by actively varying sentence architecture:
 * Combines consecutive short sentences or creates punchy thesis statements
 * to prevent robotic AI uniformity.
 */
export function injectBurstinessRhythm(sentences: string[]): string[] {
  if (sentences.length <= 2) return sentences;

  const result: string[] = [];
  let i = 0;

  while (i < sentences.length) {
    const s1 = sentences[i].trim();
    const s2 = sentences[i + 1]?.trim();
    const words1 = s1.split(/\s+/).filter(Boolean);
    const words2 = s2 ? s2.split(/\s+/).filter(Boolean) : [];

    // If we have two consecutive mid-length sentences of nearly identical length (e.g. 14w and 15w),
    // we can dynamically combine them with an em-dash, semicolon, or coordinating conjunction
    // to break the robotic monotony, creating a longer 28-word sentence, followed by a punchier next sentence.
    if (
      s2 &&
      words1.length >= 10 &&
      words1.length <= 16 &&
      words2.length >= 10 &&
      words2.length <= 16 &&
      !s1.endsWith('?') &&
      !s2.endsWith('?') &&
      !/^(however|moreover|furthermore|additionally|nevertheless)\b/i.test(s2)
    ) {
      const cleanS1 = s1.replace(/[.!]+$/, '');
      const cleanS2 = s2.charAt(0).toLowerCase() + s2.slice(1);
      // Combine with natural connector
      const combined = `${cleanS1}; particularly, ${cleanS2}`;
      result.push(combined);
      i += 2;
      continue;
    }

    result.push(s1);
    i++;
  }

  return result;
}

/**
 * Inspects a document or paragraph and verifies that domain and methodological terms
 * have remained strictly intact.
 */
export function countPreservedDomainTerms(originalText: string, paraphrasedText: string): {
  count: number;
  preservedTerms: string[];
} {
  const origLower = originalText.toLowerCase();
  const paraLower = paraphrasedText.toLowerCase();
  const preservedTerms: string[] = [];

  for (const term of INVARIANT_DOMAIN_TERMS) {
    if (origLower.includes(term)) {
      if (paraLower.includes(term)) {
        preservedTerms.push(term);
      }
    }
  }

  return {
    count: preservedTerms.length,
    preservedTerms,
  };
}

/**
 * Restores domain and methodological terms if an abstractive model replaced them
 * with unnatural or awkward pseudo-synonyms (e.g. "specimen" for "sample", "tertiary learners" for "university students").
 */
export function restoreDomainTerms(originalText: string, paraphrasedText: string): string {
  let restored = paraphrasedText;
  const origLower = originalText.toLowerCase();

  // 1. "sample" / "samples"
  if (/\bsamples?\b/i.test(origLower)) {
    restored = restored.replace(/\b(?:specimens?|test\s+subjects?|experimental\s+cohorts?)\b/gi, (match) => {
      return match.toLowerCase().endsWith('s') ? 'samples' : 'sample';
    });
  }

  // 2. "dataset" / "datasets" / "data set"
  if (/\bdata\s*sets?\b/i.test(origLower)) {
    restored = restored.replace(/\b(?:data\s+corpus|information\s+repository|collection\s+of\s+records)\b/gi, 'dataset');
  }

  // 3. "university students" / "college students"
  if (/\b(?:university|college|undergraduate)\s+students\b/i.test(origLower)) {
    restored = restored.replace(/\b(?:tertiary\s+learners|higher\s+education\s+pupils|academic\s+scholars|collegiate\s+attendees)\b/gi, 'university students');
  }

  // 4. "correlated" / "correlation"
  if (/\bcorrelat(?:ed|ion|es)\b/i.test(origLower)) {
    restored = restored.replace(/\b(?:interlinked\s+with|co-manifested\s+with|intertwined\s+with)\b/gi, 'correlated with');
  }

  return restored;
}

export interface AiDetectionReport {
  aiProbability: number; // 0 - 100% likelihood of AI detector flagging
  humanBypassScore: number; // 0 - 100% likelihood of passing as authentic human
  burstiness: BurstinessResult;
  aiCliches: string[];
  preservedDomainTerms: string[];
}

/**
 * Evaluates a block of text against typical AI detection heuristics:
 * Perplexity/burstiness variance, clichéd transitions, and domain phrasing integrity.
 */
export function evaluateAiDetection(sentences: string[], fullText: string): AiDetectionReport {
  const burstiness = calculateBurstiness(sentences);

  const foundCliches: string[] = [];
  for (const [key, config] of Object.entries(AI_VOCABULARY_MAP)) {
    if (config.pattern.test(fullText)) {
      foundCliches.push(key);
    }
  }

  const domain = countPreservedDomainTerms(fullText, fullText);

  // Baseline AI flag probability
  let aiProb = 15;

  // AI models have low sentence length variance (std dev < 4.5)
  if (burstiness.stdDev < 3.5 || burstiness.uniformRunDetected) {
    aiProb += 45;
  } else if (burstiness.stdDev < 5.2) {
    aiProb += 25;
  } else if (burstiness.stdDev >= 6.8) {
    aiProb -= 10;
  }

  // AI clichés heavily trigger GPTZero / Turnitin
  if (foundCliches.length > 0) {
    aiProb += Math.min(45, foundCliches.length * 15);
  } else {
    aiProb -= 5;
  }

  // If domain terms are natural
  if (domain.count > 0) {
    aiProb -= Math.min(10, domain.count * 2);
  }

  const finalAiProb = Math.min(99, Math.max(3, Math.round(aiProb)));
  const humanBypass = 100 - finalAiProb;

  return {
    aiProbability: finalAiProb,
    humanBypassScore: humanBypass,
    burstiness,
    aiCliches: foundCliches,
    preservedDomainTerms: domain.preservedTerms,
  };
}

/**
 * Computes estimated AI Detection Bypass Likelihood (0 - 100%)
 * based on Burstiness, AI Vocabulary absence, and Domain Term consistency.
 */
export function estimateAiBypassLikelihood(
  burstiness: BurstinessResult,
  aiClichesFound: number,
  preservedDomainCount: number
): number {
  let likelihood = 85;

  // High burstiness is the #1 defense against AI perplexity/burstiness detectors
  if (burstiness.rating === 'High (Human-like)') {
    likelihood += 10;
  } else if (burstiness.rating === 'Low (AI Uniform)') {
    likelihood -= 25;
  }

  // Deduct heavily if raw text has AI clichés
  if (aiClichesFound === 0) {
    likelihood += 4;
  } else {
    likelihood -= Math.min(25, aiClichesFound * 5);
  }

  // Preserving authentic domain terms keeps perplexity realistic
  if (preservedDomainCount > 0) {
    likelihood += Math.min(6, preservedDomainCount * 1.5);
  }

  return Math.min(99, Math.max(25, Math.round(likelihood)));
}

