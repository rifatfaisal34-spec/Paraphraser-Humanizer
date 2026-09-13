/**
 * Structure Transformer: Deterministic linguistic algorithms for:
 * - Clause reordering (fronting vs postposing subordinate clauses)
 * - Affirmative <-> Negative polarity transformations (litotes & assertion)
 * - Structure reorganization: Simple, Compound, Complex
 * - Sentence splitting & combining
 * - Word Class shifts (Nominalization & Verbification)
 */

import {
  WORD_CLASS_MAPPINGS,
  POLARITY_PAIRS,
  SUBORDINATING_CONJUNCTIONS,
  ACADEMIC_CONNECTORS,
  PROFESSIONAL_CONNECTORS,
  CASUAL_CONNECTORS,
} from './lexicon';
import { SentenceStructure, ToneStyle, WordChange } from '../types';
import { sanitizePunctuationSpacing } from './sanitizer';

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function uncapitalize(str: string): string {
  if (!str) return '';
  if (str.startsWith('I ') || str === 'I') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export interface TransformResult {
  text: string;
  modified: boolean;
  ruleExplanation?: string;
  wordChanges: WordChange[];
}

// Module-level monotonic counter for guaranteed unique IDs
let structUniqueCounter = 0;
function getNextUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++structUniqueCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * 1. Clause Reordering (Information Inversion)
 * Reorders independent and dependent clauses while preserving logical flow.
 * e.g., "Because X, Y." <-> "Y, because X."
 */
export function reorderClauses(sentence: string): TransformResult {
  const endingPunct = sentence.match(/[.!?]+$/)?.[0] || '.';
  const clean = sentence.trim().replace(/[.!?]+$/, '');
  const wordChanges: WordChange[] = [];

  // Guard: Never reorder if there are colons, semicolons, quotes, or unmatched parentheses
  if (clean.includes(':') || clean.includes(';') || clean.includes('"') || clean.includes('“')) {
    return { text: sentence, modified: false, wordChanges: [] };
  }
  const openParens = (clean.match(/\(/g) || []).length;
  const closeParens = (clean.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return { text: sentence, modified: false, wordChanges: [] };
  }

  // Pattern A: Subordinating conjunction at start: "[SubConj] [ClauseA], [ClauseB]"
  for (const conj of ['Because', 'Although', 'Even though', 'While', 'Whereas', 'Since', 'Given that', 'Inasmuch as', 'If', 'When', 'After', 'Before', 'Unless', 'As long as', 'Provided that']) {
    const startRegex = new RegExp(`^${conj}\\s+([^,]+),\\s*(.+)$`, 'i');
    const match = clean.match(startRegex);
    if (match) {
      const clauseA = match[1].trim();
      const clauseB = match[2].trim();

      // Ensure both clauses have substantive length (>= 4 words)
      if (clauseA.split(/\s+/).length >= 4 && clauseB.split(/\s+/).length >= 4) {
        const newSentence = `${capitalize(clauseB)} ${conj.toLowerCase()} ${uncapitalize(clauseA)}${endingPunct}`;
        const sanitized = sanitizePunctuationSpacing(newSentence);
        return {
          text: sanitized,
          modified: true,
          ruleExplanation: `Inverted clause order: shifted subordinate clause "${conj.toLowerCase()} ${clauseA}" to the end after main clause "${clauseB}".`,
          wordChanges: [
            {
              id: getNextUniqueId('reorder'),
              original: clean,
              replaced: sanitized,
              alternatives: [sentence],
              technique: 'clause_reorder',
              startIndex: 0,
              endIndex: sanitized.length,
              notes: `Subordinate clause inversion using "${conj}"`,
            },
          ],
        };
      }
    }
  }

  // Pattern B: Subordinating conjunction in middle: "[ClauseB] [conj] [ClauseA]"
  for (const conj of ['because', 'although', 'even though', 'while', 'whereas', 'since', 'given that', 'if', 'when', 'after', 'before', 'unless', 'as long as', 'provided that']) {
    const middleRegex = new RegExp(`^(.+?)\\s*,?\\s+\\b${conj}\\b\\s+(.+)$`, 'i');
    const midMatch = clean.match(middleRegex);
    if (midMatch) {
      const clauseB = midMatch[1].trim();
      const clauseA = midMatch[2].trim();

      // Guard against "because of"
      if (conj === 'because' && /^of\b/i.test(clauseA)) {
        continue;
      }

      // Guard: clauseB should not end with comparative or scoping adverbs/prepositions
      if (/\b(?:such|just|simply|partly|largely|primarily|as)\s*$/i.test(clauseB)) {
        continue;
      }

      // Ensure both clauses are valid (>= 4 words each)
      const bWords = clauseB.split(/\s+/);
      const aWords = clauseA.split(/\s+/);
      if (bWords.length >= 4 && aWords.length >= 4) {
        // Check for presence of finite verb or modal in both clauses
        const hasVerbInA = /\b(?:is|are|was|were|can|could|may|might|will|would|should|have|has|had|do|does|did|show|shows|showed|indicate|indicates|compare|compares|compared|use|uses|used|find|finds|found|lead|leads|led|affect|affects|affected|correlate|correlates)\b|[a-z]+ed\b|[a-z]+s\b/i.test(clauseA);
        const hasVerbInB = /\b(?:is|are|was|were|can|could|may|might|will|would|should|have|has|had|do|does|did|show|shows|showed|indicate|indicates|compare|compares|compared|use|uses|used|find|finds|found|lead|leads|led|affect|affects|affected|correlate|correlates)\b|[a-z]+ed\b|[a-z]+s\b/i.test(clauseB);

        if (hasVerbInA && hasVerbInB) {
          const newSentence = `${capitalize(conj)} ${uncapitalize(clauseA)}, ${uncapitalize(clauseB)}${endingPunct}`;
          const sanitized = sanitizePunctuationSpacing(newSentence);
          return {
            text: sanitized,
            modified: true,
            ruleExplanation: `Fronted subordinate clause: moved "${conj} ${clauseA}" to the beginning of the sentence for syntactic variety.`,
            wordChanges: [
              {
                id: getNextUniqueId('reorder'),
                original: clean,
                replaced: sanitized,
                alternatives: [sentence],
                technique: 'clause_reorder',
                startIndex: 0,
                endIndex: sanitized.length,
                notes: `Fronted subordinate clause with "${conj}"`,
              },
            ],
          };
        }
      }
    }
  }

  // Pattern C: Prepositional Frame Inversion (e.g. "In this investigation, X did Y." <-> "X did Y in this investigation.")
  const prepFrontRegex = /^(In this [^,]+|Across the [^,]+|Throughout this [^,]+|During the [^,]+|Within this [^,]+),\s*(.+)$/i;
  const prepMatch = clean.match(prepFrontRegex);
  if (prepMatch) {
    const prepPhrase = prepMatch[1].trim();
    const mainBody = prepMatch[2].trim();
    if (mainBody.split(/\s+/).length >= 5 && !mainBody.includes(':')) {
      const newSentence = `${capitalize(mainBody)} ${uncapitalize(prepPhrase)}${endingPunct}`;
      const sanitized = sanitizePunctuationSpacing(newSentence);
      return {
        text: sanitized,
        modified: true,
        ruleExplanation: `Shifted topical prepositional frame "${prepPhrase}" to the end of the sentence to vary entry cadence.`,
        wordChanges: [
          {
            id: getNextUniqueId('reorder'),
            original: clean,
            replaced: sanitized,
            alternatives: [sentence],
            technique: 'clause_reorder',
            startIndex: 0,
            endIndex: sanitized.length,
            notes: `Topical prepositional inversion`,
          },
        ],
      };
    }
  }

  return { text: sentence, modified: false, wordChanges: [] };
}

/**
 * 2. Affirmative <-> Negative Inversion
 * Handles litotes (understatement via double negative) and direct positive assertion.
 */
export function togglePolarity(sentence: string, targetMode?: 'affirmative' | 'negative'): TransformResult {
  let currentText = sentence;
  const wordChanges: WordChange[] = [];
  const explanations: string[] = [];

  for (const pair of POLARITY_PAIRS) {
    // Mode A: Negative to Affirmative
    const negRegex = new RegExp(`\\b${pair.negative}\\b`, 'gi');
    if (negRegex.test(currentText) && targetMode !== 'negative') {
      const originalMatched = currentText.match(negRegex)?.[0] || pair.negative;
      currentText = currentText.replace(negRegex, pair.affirmative);
      explanations.push(`Converted litotes/negative "${originalMatched}" to affirmative "${pair.affirmative}"`);
      wordChanges.push({
        id: getNextUniqueId('pol'),
        original: originalMatched,
        replaced: pair.affirmative,
        alternatives: [originalMatched],
        technique: 'polarity_change',
        startIndex: 0,
        endIndex: currentText.length,
        notes: 'Affirmative polarity restructuring',
      });
      break;
    }
    // Mode B: Affirmative to Negative (Litotes / Opposite Expression)
    else if (targetMode === 'negative' || (!targetMode && !currentText.includes(pair.negative))) {
      if (pair.context === 'predicate') {
        const affRegex = new RegExp(`\\b(is|are|was|were|seems|remains)\\s+${pair.affirmative}\\b`, 'gi');
        if (affRegex.test(currentText)) {
          currentText = currentText.replace(affRegex, (match, verb) => `${verb} ${pair.negative}`);
          explanations.push(`Shifted affirmative "${pair.affirmative}" to rhetorical litotes "${pair.negative}"`);
          wordChanges.push({
            id: getNextUniqueId('pol'),
            original: pair.affirmative,
            replaced: pair.negative,
            alternatives: [pair.affirmative],
            technique: 'polarity_change',
            startIndex: 0,
            endIndex: currentText.length,
            notes: 'Rhetorical litotes transformation',
          });
          break;
        }
      } else {
        const affRegex = new RegExp(`\\b${pair.affirmative}\\b`, 'gi');
        if (affRegex.test(currentText)) {
          const originalMatched = currentText.match(affRegex)?.[0] || pair.affirmative;
          currentText = currentText.replace(affRegex, pair.negative);
          explanations.push(`Shifted "${originalMatched}" to opposite construction "${pair.negative}"`);
          wordChanges.push({
            id: getNextUniqueId('pol'),
            original: originalMatched,
            replaced: pair.negative,
            alternatives: [originalMatched],
            technique: 'polarity_change',
            startIndex: 0,
            endIndex: currentText.length,
            notes: 'Opposite word transformation',
          });
          break;
        }
      }
    }
  }

  return {
    text: currentText,
    modified: wordChanges.length > 0,
    ruleExplanation: explanations.join('; '),
    wordChanges,
  };
}

/**
 * Randomly transforms sentence polarity if a suitable opposite word or litotes expression exists
 */
export function randomlyTogglePolarity(sentence: string): TransformResult {
  // Check if suitable opposite/polarity words exist
  const hasMatchingOpposite = POLARITY_PAIRS.some((pair) => {
    if (new RegExp(`\\b${pair.negative}\\b`, 'i').test(sentence)) return true;
    if (pair.context === 'predicate') {
      return new RegExp(`\\b(is|are|was|were|seems|remains)\\s+${pair.affirmative}\\b`, 'i').test(sentence);
    }
    return new RegExp(`\\b${pair.affirmative}\\b`, 'i').test(sentence);
  });

  if (!hasMatchingOpposite) {
    return { text: sentence, modified: false, wordChanges: [] };
  }

  // Randomly transform (50% probability when suitable opposite exists)
  if (Math.random() < 0.55) {
    return togglePolarity(sentence);
  }

  return { text: sentence, modified: false, wordChanges: [] };
}

/**
 * 3. Word Class Transformation (Nominalization & Verbification)
 * e.g., "analyses the data" -> "conducts an analysis of the data"
 * e.g., "conducts an analysis of" -> "analyses"
 */
export function transformWordClass(sentence: string, direction: 'nominalize' | 'verbify' = 'nominalize'): TransformResult {
  let text = sentence;
  const wordChanges: WordChange[] = [];
  const explanations: string[] = [];

  for (const [key, entry] of Object.entries(WORD_CLASS_MAPPINGS)) {
    if (direction === 'nominalize') {
      // Past tense: "analyzed" -> "conducted an analysis of"
      // CRITICAL: NEVER nominalize if preceded by a passive auxiliary: "was analyzed by" MUST NOT become "was conducted an analysis of by"
      const passiveCheckRegex = new RegExp(`\\b(was|were|is|are|been|being|be)\\s+(?:\\w+\\s+)?${entry.verbPast}\\b`, 'i');
      if (!passiveCheckRegex.test(text)) {
        const pastRegex = new RegExp(`\\b${entry.verbPast}\\b`, 'g');
        if (pastRegex.test(text)) {
          text = text.replace(pastRegex, entry.nominalPhrase.past);
          explanations.push(`Shifted verb "${entry.verbPast}" to nominal construction "${entry.nominalPhrase.past}"`);
          wordChanges.push({
            id: getNextUniqueId('wc'),
            original: entry.verbPast,
            replaced: entry.nominalPhrase.past,
            alternatives: [entry.verbPast, entry.verb],
            technique: 'word_class',
            startIndex: 0,
            endIndex: 0,
            notes: `Nominalization of ${entry.verb}`,
          });
        }
      }

      // Third person: "analyzes" -> "conducts an analysis of"
      const thirdPassiveCheck = new RegExp(`\\b(is|are|been|being|be)\\s+${entry.verbThirdPerson}\\b`, 'i');
      if (!thirdPassiveCheck.test(text)) {
        const thirdRegex = new RegExp(`\\b${entry.verbThirdPerson}\\b`, 'g');
        if (thirdRegex.test(text)) {
          text = text.replace(thirdRegex, entry.nominalPhrase.thirdPerson);
          explanations.push(`Shifted verb "${entry.verbThirdPerson}" to nominal construction "${entry.nominalPhrase.thirdPerson}"`);
          wordChanges.push({
            id: getNextUniqueId('wc'),
            original: entry.verbThirdPerson,
            replaced: entry.nominalPhrase.thirdPerson,
            alternatives: [entry.verbThirdPerson, entry.verb],
            technique: 'word_class',
            startIndex: 0,
            endIndex: 0,
            notes: `Nominalization of ${entry.verb}`,
          });
        }
      }

      // Base / infinitive: "to analyze" -> "to conduct an analysis of"
      const baseRegex = new RegExp(`\\bto\\s+${entry.verb}\\b`, 'g');
      if (baseRegex.test(text)) {
        text = text.replace(baseRegex, `to ${entry.nominalPhrase.base}`);
        explanations.push(`Nominalized infinitive "to ${entry.verb}" into "to ${entry.nominalPhrase.base}"`);
        wordChanges.push({
          id: getNextUniqueId('wc'),
          original: `to ${entry.verb}`,
          replaced: `to ${entry.nominalPhrase.base}`,
          alternatives: [`to ${entry.verb}`],
          technique: 'word_class',
          startIndex: 0,
          endIndex: 0,
          notes: `Infinitive nominalization`,
        });
      }
    } else {
      // Verbification: "conducted an analysis of" -> "analyzed"
      const nomPastRegex = new RegExp(`\\b${entry.nominalPhrase.past}\\b`, 'gi');
      if (nomPastRegex.test(text)) {
        text = text.replace(nomPastRegex, entry.verbPast);
        explanations.push(`De-nominalized "${entry.nominalPhrase.past}" into active verb "${entry.verbPast}"`);
        wordChanges.push({
          id: getNextUniqueId('wc'),
          original: entry.nominalPhrase.past,
          replaced: entry.verbPast,
          alternatives: [entry.nominalPhrase.past],
          technique: 'word_class',
          startIndex: 0,
          endIndex: 0,
          notes: `Verbification to ${entry.verb}`,
        });
      }
    }
  }

  return {
    text,
    modified: wordChanges.length > 0,
    ruleExplanation: explanations.join('; '),
    wordChanges,
  };
}

/**
 * 4. Structure Conversion: Simple, Compound, Complex
 */
export function changeStructure(
  sentence: string,
  targetStructure: SentenceStructure,
  tone: ToneStyle = 'professional'
): TransformResult {
  if (targetStructure === 'preserve') {
    return { text: sentence, modified: false, wordChanges: [] };
  }

  const endingPunct = sentence.match(/[.!?]+$/)?.[0] || '.';
  const clean = sentence.trim().replace(/[.!?]+$/, '');

  if (targetStructure === 'compound') {
    // Semicolon compound conversion: "Clause 1; Clause 2" -> "Clause 1, and Clause 2"
    if (clean.includes(';')) {
      const parts = clean.split(';').map((p) => p.trim());
      if (parts.length === 2 && parts[0].length > 10 && parts[1].length > 10) {
        const connector = ', and ';
        const newText = `${parts[0]}${connector}${uncapitalize(parts[1])}${endingPunct}`;
        return {
          text: newText,
          modified: true,
          ruleExplanation: `Synthesized compound sentence using coordinating conjunction "${connector.trim()}".`,
          wordChanges: [
            {
              id: getNextUniqueId('struct'),
              original: clean,
              replaced: newText,
              alternatives: [sentence],
              technique: 'structural_complexity',
              startIndex: 0,
              endIndex: newText.length,
              notes: 'Compound syntax synthesis',
            },
          ],
        };
      }
    }
  } else if (targetStructure === 'complex') {
    // Invert existing subordinate clauses: "Although/Because/While [Clause A], [Clause B]" <-> "[Clause B], although/because/while [Clause A]"
    const subMatch = clean.match(/^(although|even though|while|whereas|since|because)\s+([^,]+),\s*(.+)$/i);
    if (subMatch) {
      const conj = subMatch[1].toLowerCase();
      const clauseA = subMatch[2].trim();
      const clauseB = subMatch[3].trim();
      const newText = `${capitalize(clauseB)}, ${conj} ${uncapitalize(clauseA)}${endingPunct}`;
      return {
        text: newText,
        modified: true,
        ruleExplanation: `Shifted subordinate clause "${conj} ${clauseA}" to post-verbal position.`,
        wordChanges: [
          {
            id: getNextUniqueId('struct'),
            original: clean,
            replaced: newText,
            alternatives: [sentence],
            technique: 'structural_complexity',
            startIndex: 0,
            endIndex: newText.length,
            notes: 'Subordinate clause inversion',
          },
        ],
      };
    }
  } else if (targetStructure === 'simple') {
    // Complex to Simple: "Although [Clause A], [Clause B]" -> "[Clause B] despite the fact that [Clause A]"
    const subMatch = clean.match(/^(although|even though|while)\s+([^,]+),\s*(.+)$/i);
    if (subMatch) {
      const clauseA = subMatch[2].trim();
      const clauseB = subMatch[3].trim();
      const newText = `${capitalize(clauseB)} despite the fact that ${uncapitalize(clauseA)}${endingPunct}`;
      return {
        text: newText,
        modified: true,
        ruleExplanation: 'Streamlined complex subordinate clause into a concise structure with prepositional concession.',
        wordChanges: [
          {
            id: getNextUniqueId('struct'),
            original: clean,
            replaced: newText,
            alternatives: [sentence],
            technique: 'structural_complexity',
            startIndex: 0,
            endIndex: newText.length,
            notes: 'Simple syntax rephrasing',
          },
        ],
      };
    }
  }

  return { text: sentence, modified: false, wordChanges: [] };
}

/**
 * Randomly changes sentence structure among simple, compound, and complex
 * Only applies transformations if the sentence has clean grammatical prerequisites.
 */
export function randomlyChangeStructure(
  sentence: string,
  tone: ToneStyle = 'professional'
): { res: TransformResult; structure: 'simple' | 'compound' | 'complex' } {
  const isCompound = sentence.includes(';') || /,\s*(and|but|yet|so)\b/i.test(sentence);
  const isComplex = /^(although|even though|while|whereas|since|because)\b/i.test(sentence);
  const currentStructure: 'simple' | 'compound' | 'complex' = isCompound ? 'compound' : isComplex ? 'complex' : 'simple';

  if (isComplex) {
    const res = changeStructure(sentence, 'complex', tone);
    if (res.modified) {
      return { res, structure: 'complex' };
    }
  } else if (sentence.includes(';')) {
    const res = changeStructure(sentence, 'compound', tone);
    if (res.modified) {
      return { res, structure: 'compound' };
    }
  }

  return {
    res: { text: sentence, modified: false, wordChanges: [] },
    structure: currentStructure,
  };
}

/**
 * 5. Sentence Splitting & Combining
 */
export function splitSentence(sentence: string): { sentences: string[]; wasSplit: boolean; explanation?: string } {
  const endingPunct = sentence.match(/[.!?]+$/)?.[0] || '.';
  const clean = sentence.trim().replace(/[.!?]+$/, '');

  // Split conditions:
  // 1. Semicolon: Only split if the overall compound sentence is truly excessively long (> 28 words)
  // Semicolons are a standard, deliberate stylistic device in academic and professional prose.
  if (clean.includes(';')) {
    const parts = clean.split(';').map((p) => p.trim());
    if (
      parts.length === 2 &&
      parts[0].split(/\s+/).length >= 12 &&
      parts[1].split(/\s+/).length >= 12 &&
      (parts[0].split(/\s+/).length + parts[1].split(/\s+/).length) >= 28
    ) {
      return {
        sentences: [`${capitalize(parts[0])}.`, `${capitalize(parts[1])}${endingPunct}`],
        wasSplit: true,
        explanation: 'Divided long compound semicolon structure into two independent sentences.',
      };
    }
  }

  // 2. Coordinate conjunction with comma: ", and ", ", but ", ", whereas "
  // CRITICAL: Part 2 MUST begin with an explicit independent subject (noun phrase or pronoun)
  // It MUST NOT split compound predicates (e.g., "We did X, and did Y" -> NO subject in second part)
  const conjMatch = clean.match(
    /^(.+?),\s*(and|but|whereas|while)\s+((?:the|this|that|these|those|we|they|it|he|she|such|researchers|engineers|authors|users|results|data|findings)\b.+)$/i
  );
  if (conjMatch) {
    const part1 = conjMatch[1].trim();
    const conj = conjMatch[2].toLowerCase();
    const part2 = conjMatch[3].trim();

    // Ensure both parts are substantial independent clauses (> 7 words each)
    if (part1.split(/\s+/).length >= 7 && part2.split(/\s+/).length >= 7) {
      let prefix = '';
      if (conj === 'but' || conj === 'whereas') {
        prefix = 'However, ';
      } else if (conj === 'and') {
        // In natural English, two independent sentences stand cleanly side-by-side.
        // Avoid robotic overuse of "Additionally, "
        prefix = '';
      }

      return {
        sentences: [`${capitalize(part1)}.`, `${prefix}${capitalize(part2)}${endingPunct}`],
        wasSplit: true,
        explanation: `Divided compound coordinate sentence linked by "${conj}" into two independent sentences.`,
      };
    }
  }

  return { sentences: [sentence], wasSplit: false };
}

export function combineSentences(sentenceA: string, sentenceB: string, tone: ToneStyle = 'professional'): {
  combinedText: string;
  wasCombined: boolean;
  explanation?: string;
} {
  const cleanA = sentenceA.trim().replace(/[.!?]+$/, '');
  const cleanB = sentenceB.trim().replace(/[.!?]+$/, '');
  const endingPunct = sentenceB.match(/[.!?]+$/)?.[0] || '.';

  // Check if B already starts with a transition word like "However", "Furthermore", etc.
  if (/^(however|furthermore|moreover|additionally|therefore|consequently|meanwhile)\b/i.test(cleanB)) {
    return { combinedText: `${cleanA}. ${cleanB}${endingPunct}`, wasCombined: false };
  }

  // Connect cleanly with coordinating conjunction ", and "
  const combined = `${cleanA}, and ${uncapitalize(cleanB)}${endingPunct}`;
  return {
    combinedText: combined,
    wasCombined: true,
    explanation: `Synthesized two adjacent sentences into one cohesive compound sentence using ", and".`,
  };
}
