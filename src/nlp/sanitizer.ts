/**
 * Post-Processing Sanitizer Module
 * Enforces strict typographic, spacing, punctuation, and grammatical cleanup.
 */

/**
 * Sanitizes spacing around punctuation, ensuring periods and terminal marks
 * are strictly followed by a space when followed by alphanumeric characters.
 */
export function sanitizePunctuationSpacing(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Rule 1: Ensure period is followed by space when followed by letter or digit
  // e.g. "students.The" -> "students. The", "responses.29" -> "responses. 29"
  // Exception: Decimals like 3.14 or abbreviations like e.g. or et al.
  sanitized = sanitized.replace(/([a-z]{2,})\.([A-Z0-9])/g, '$1. $2');
  sanitized = sanitized.replace(/\.([A-Z])/g, (match, p1, offset, string) => {
    // If preceded by single letter like e.g. or i.e. don't add space
    const before = string.slice(Math.max(0, offset - 4), offset);
    if (/\b(?:e\.g|i\.e|al|vs|etc|dr|mr|ms|prof)\b/i.test(before)) {
      return match;
    }
    return `. ${p1}`;
  });

  // Rule 2: Question mark and exclamation mark spacing
  sanitized = sanitized.replace(/([!?])([A-Za-z0-9])/g, '$1 $2');

  // Rule 3: Colon, semicolon, and comma spacing
  sanitized = sanitized.replace(/([:;,])([A-Za-z])/g, '$1 $2');

  // Rule 4: Remove accidental spaces BEFORE punctuation
  sanitized = sanitized.replace(/\s+([.,!?;:])/g, '$1');

  // Rule 5: Fix double punctuation
  sanitized = sanitized.replace(/([.!?])\s*[.!?]+/g, '$1');
  sanitized = sanitized.replace(/;\s*;/g, ';');
  sanitized = sanitized.replace(/,\s*,/g, ',');

  // Rule 6: Fix double prepositions resulting from nominalization
  sanitized = sanitized.replace(/\b(conducted an analysis of|conduct an analysis of|conducts an analysis of|conducting an analysis of)\s+of\b/gi, '$1');
  sanitized = sanitized.replace(/\b(carried out an investigation into|carry out an investigation into)\s+into\b/gi, '$1');
  sanitized = sanitized.replace(/\b(achieved a reduction in|achieve a reduction in)\s+in\b/gi, '$1');

  // Rule 7: Fix redundant double connectors like "Although additionally," or "However furthermore,"
  sanitized = sanitized.replace(/^(although|whereas|while|since)\s+(?:additionally|furthermore|moreover|however|in addition),?\s*/i, '$1 ');
  sanitized = sanitized.replace(/^(?:additionally|furthermore|moreover|in addition),?\s+(additionally|furthermore|moreover|however|in addition),?\s*/i, '$1, ');

  // Rule 8: Normalize excessive whitespace
  sanitized = sanitized.replace(/[ \t]{2,}/g, ' ').trim();

  // Rule 9: Ensure initial character is uppercase
  if (sanitized.length > 0) {
    sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  }

  return sanitized;
}
