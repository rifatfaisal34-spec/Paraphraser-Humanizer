import { lockStatisticalAndAcademicExpressions } from './entityProtection';

/**
 * Post-Processing Sanitizer Module
 * Enforces strict typographic, spacing, punctuation, and grammatical cleanup
 * while guaranteeing 100% preservation of statistical notation, decimals, and formulas.
 */

/**
 * Sanitizes spacing around punctuation, ensuring periods and terminal marks
 * are strictly followed by a space when followed by uppercase letters,
 * without corrupting decimal numbers or statistical expressions.
 */
export function sanitizePunctuationSpacing(text: string): string {
  if (!text) return '';

  // Lock all statistical notations, parentheticals, citations, and decimal values
  const { lockedText, restore } = lockStatisticalAndAcademicExpressions(text);
  let sanitized = lockedText;

  // Rule 1: Ensure period is followed by space when followed by an uppercase letter (new sentence)
  // e.g. "students.The" -> "students. The". NEVER match digits!
  sanitized = sanitized.replace(/([a-z]{2,})\.([A-Z])/g, '$1. $2');
  sanitized = sanitized.replace(/\.([A-Z])/g, (match, p1, offset, string) => {
    // If preceded by abbreviation like e.g. or i.e. don't add space
    const before = string.slice(Math.max(0, offset - 4), offset);
    if (/\b(?:e\.g|i\.e|al|vs|etc|dr|mr|ms|prof)\b/i.test(before)) {
      return match;
    }
    return `. ${p1}`;
  });

  // Rule 2: Question mark and exclamation mark spacing
  sanitized = sanitized.replace(/([!?])([A-Za-z])/g, '$1 $2');

  // Rule 3: Colon, semicolon, and comma spacing (only when followed by letters, not digits)
  sanitized = sanitized.replace(/([:;,])([A-Za-z])/g, '$1 $2');

  // Rule 4: Remove accidental spaces BEFORE punctuation (only if not preceded by locked token)
  sanitized = sanitized.replace(/\s+([.,!?;:])/g, '$1');

  // Rule 5: Fix double punctuation
  sanitized = sanitized.replace(/([.!?])\s*[.!?]+/g, '$1');
  sanitized = sanitized.replace(/;\s*;/g, ';');
  sanitized = sanitized.replace(/,\s*,/g, ',');

  // Rule 6: Fix double prepositions resulting from nominalization
  sanitized = sanitized.replace(/\b(conducted an analysis of|conduct an analysis of|conducts an analysis of|conducting an analysis of)\s+of\b/gi, '$1');
  sanitized = sanitized.replace(/\b(carried out an investigation into|carry out an investigation into)\s+into\b/gi, '$1');
  sanitized = sanitized.replace(/\b(achieved a reduction in|achieve a reduction in)\s+in\b/gi, '$1');

  // Rule 7: Fix misplaced commas around verbal bridges and prepositions
  // e.g. "is, generally conceptualized as, a" -> "is generally conceptualized as a"
  sanitized = sanitized.replace(/\b(is|are|was|were),\s+(generally|broadly|commonly|traditionally|typically|often|widely)?\s*(conceptualized|defined|understood|viewed|regarded|described|interpreted|characterized)\s+as,\s*/gi, '$1 $2 $3 as ');
  sanitized = sanitized.replace(/\b(is|are|was|were),\s+([^,]+?),\s+(a|an|the|their|his|her|its|our|one)\b/gi, (match, verb, phrase, det) => {
    if (/\b(?:as|of|to|for|in|with|that|by)\b/i.test(phrase) || /\b(?:conceptualized|defined|viewed|regarded|known|characterized)\b/i.test(phrase)) {
      return `${verb} ${phrase.trim()} ${det}`;
    }
    return match;
  });
  // Strip comma directly after preposition before an argument/determiner (e.g. "as, a person" -> "as a person")
  sanitized = sanitized.replace(/\b(as|of|to|for|with|from|into|about|through),\s+(a|an|the|their|his|her|its|our|one|[A-Za-z]+)\b/gi, '$1 $2');

  // Rule 8: Fix redundant double connectors like "Although additionally," or "However furthermore,"
  sanitized = sanitized.replace(/^(although|whereas|while|since)\s+(?:additionally|furthermore|moreover|however|in addition),?\s*/i, '$1 ');
  sanitized = sanitized.replace(/^(?:additionally|furthermore|moreover|in addition),?\s+(additionally|furthermore|moreover|however|in addition),?\s*/i, '$1, ');

  // Rule 9: Normalize excessive whitespace
  sanitized = sanitized.replace(/[ \t]{2,}/g, ' ').trim();

  // Rule 10: Ensure initial character is uppercase
  if (sanitized.length > 0) {
    sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  }

  // Restore all locked statistical and academic expressions exactly as originally formatted
  return restore(sanitized);
}
