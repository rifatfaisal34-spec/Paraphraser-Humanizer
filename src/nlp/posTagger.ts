/**
 * Lightweight Context-Aware Part-of-Speech (POS) Tagger
 * Accurately determines syntactic category (Noun, Verb, Adj, Adv, etc.)
 * in English sentences to prevent part-of-speech substitution errors.
 */

export type POSTag =
  | 'NOUN'
  | 'VERB'
  | 'ADJ'
  | 'ADV'
  | 'DET'
  | 'PREP'
  | 'PRON'
  | 'CONJ'
  | 'NUM'
  | 'PUNCT'
  | 'OTHER';

export interface TaggedToken {
  token: string;
  cleanWord: string;
  tag: POSTag;
  index: number;
}

const DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her',
  'its', 'our', 'their', 'all', 'both', 'each', 'every', 'any', 'some', 'no',
  'neither', 'either', 'such', 'what', 'which', 'whose',
]);

const PREPOSITIONS = new Set([
  'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'about', 'as', 'into',
  'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during',
  'without', 'before', 'under', 'around', 'among', 'upon', 'within', 'toward',
  'towards', 'of',
]);

const PRONOUNS = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'someone', 'anyone', 'everyone', 'nobody', 'nothing', 'everything', 'something',
]);

const MODAL_AND_AUX_VERBS = new Set([
  'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did',
]);

const COMMON_ADVERB_SUFFIXES = ['ly', 'ward', 'wards', 'wise'];

/**
 * Tokenizes a sentence into word tokens and punctuation markers
 */
export function tokenizeSentence(sentence: string): string[] {
  return sentence.split(/(\s+|[.,!?;:()"'])/).filter(Boolean);
}

/**
 * Perform rule-based context-aware POS tagging on a sentence
 */
export function tagSentence(sentence: string): TaggedToken[] {
  const rawTokens = tokenizeSentence(sentence);
  const result: TaggedToken[] = [];
  const wordsOnly: { word: string; token: string; rawIdx: number }[] = [];

  rawTokens.forEach((t, i) => {
    const clean = t.toLowerCase().replace(/[^a-z0-9'-]/g, '');
    if (clean && !/^\s+$/.test(t)) {
      wordsOnly.push({ word: clean, token: t, rawIdx: i });
    }
  });

  const wordTags: POSTag[] = new Array(wordsOnly.length).fill('OTHER');

  for (let i = 0; i < wordsOnly.length; i++) {
    const { word } = wordsOnly[i];
    const prevWord = i > 0 ? wordsOnly[i - 1].word : '';
    const nextWord = i + 1 < wordsOnly.length ? wordsOnly[i + 1].word : '';
    const prevTag = i > 0 ? wordTags[i - 1] : undefined;

    // 1. Numbers
    if (/^\d+(\.\d+)?%?$/.test(word) || /^(one|two|three|four|five|six|seven|eight|nine|ten|\d+)$/i.test(word)) {
      wordTags[i] = 'NUM';
      continue;
    }

    // 2. Determiners
    if (DETERMINERS.has(word)) {
      wordTags[i] = 'DET';
      continue;
    }

    // 3. Prepositions
    if (PREPOSITIONS.has(word)) {
      wordTags[i] = 'PREP';
      continue;
    }

    // 4. Pronouns
    if (PRONOUNS.has(word)) {
      wordTags[i] = 'PRON';
      continue;
    }

    // 5. Auxiliaries & Modals
    if (MODAL_AND_AUX_VERBS.has(word)) {
      wordTags[i] = 'VERB';
      continue;
    }

    // 6. Special Handling for "USE" (The exact issue reported by user!)
    if (word === 'use') {
      // Is "use" a NOUN or a VERB?
      // Cases where "use" is definitely a NOUN:
      // a) Followed by auxiliary/finite verb: "use was", "use is", "use were", "use showed"
      const isFollowedByVerb = MODAL_AND_AUX_VERBS.has(nextWord) || /^(was|is|were|are|has|had|can|could|will|would|suggested|showed|demonstrated|differed|correlated|predicted|increased|decreased)$/.test(nextWord);

      // b) Preceded by an adjective or determiner: "social media use", "greater use", "daily use", "frequent use", "their use", "the use"
      const isPrecededByAdjOrNoun =
        prevTag === 'DET' ||
        prevTag === 'ADJ' ||
        DETERMINERS.has(prevWord) ||
        /^(greater|higher|lower|daily|frequent|excessive|moderate|heavy|constant|regular|prolonged|habitual|media|technology|internet|screen|smartphone|device|substance|drug|computer|social-media)$/.test(prevWord);

      // c) Preceded by preposition: "of use", "in use", "with use", "during use"
      const isPrecededByPrep = PREPOSITIONS.has(prevWord) && prevWord !== 'to';

      // d) Followed by preposition: "use of", "use among", "use within", "use with"
      const isFollowedByPrep = PREPOSITIONS.has(nextWord);

      // e) Preceded by "to" as infinitive: "to use" -> VERB
      if (prevWord === 'to') {
        wordTags[i] = 'VERB';
      } else if (isFollowedByVerb || isPrecededByAdjOrNoun || isPrecededByPrep || isFollowedByPrep) {
        wordTags[i] = 'NOUN';
      } else if (i === 0 && (nextWord === 'of' || nextWord === 'in' || isFollowedByVerb)) {
        wordTags[i] = 'NOUN';
      } else if (prevTag === 'PRON' || prevTag === 'NOUN') {
        // "They use...", "Researchers use..." -> VERB
        wordTags[i] = 'VERB';
      } else {
        // Default to noun in academic/research contexts unless preceded by subject pronoun
        wordTags[i] = 'NOUN';
      }
      continue;
    }

    // 7. General morphology clues
    if (COMMON_ADVERB_SUFFIXES.some(s => word.endsWith(s)) && !['early', 'daily', 'friendly', 'likely'].includes(word)) {
      wordTags[i] = 'ADV';
      continue;
    }

    if (word.endsWith('tion') || word.endsWith('ment') || word.endsWith('ence') || word.endsWith('ance') || word.endsWith('ness') || word.endsWith('ism') || word.endsWith('ity')) {
      wordTags[i] = 'NOUN';
      continue;
    }

    if (word.endsWith('able') || word.endsWith('ible') || word.endsWith('ous') || word.endsWith('al') || word.endsWith('ive') || word.endsWith('ful')) {
      wordTags[i] = 'ADJ';
      continue;
    }

    if (word.endsWith('ize') || word.endsWith('ise') || word.endsWith('ate') || word.endsWith('ify')) {
      wordTags[i] = 'VERB';
      continue;
    }

    // Contextual fallback:
    // If preceded by determiner or adjective and followed by verb/preposition -> NOUN
    if ((prevTag === 'DET' || prevTag === 'ADJ') && (MODAL_AND_AUX_VERBS.has(nextWord) || PREPOSITIONS.has(nextWord) || !nextWord)) {
      wordTags[i] = 'NOUN';
      continue;
    }

    // If preceded by modal verb or "to" -> VERB
    if (prevWord === 'to' || MODAL_AND_AUX_VERBS.has(prevWord)) {
      wordTags[i] = 'VERB';
      continue;
    }

    // Default heuristics
    wordTags[i] = 'NOUN';
  }

  // Map back to all raw tokens
  let wordIdx = 0;
  rawTokens.forEach((tok, rawIdx) => {
    if (/^\s+$/.test(tok)) {
      return;
    }
    if (/^[.,!?;:()"']+$/.test(tok)) {
      result.push({
        token: tok,
        cleanWord: tok,
        tag: 'PUNCT',
        index: rawIdx,
      });
      return;
    }

    if (wordIdx < wordsOnly.length && wordsOnly[wordIdx].rawIdx === rawIdx) {
      result.push({
        token: tok,
        cleanWord: wordsOnly[wordIdx].word,
        tag: wordTags[wordIdx],
        index: rawIdx,
      });
      wordIdx++;
    } else {
      result.push({
        token: tok,
        cleanWord: tok.toLowerCase(),
        tag: 'OTHER',
        index: rawIdx,
      });
    }
  });

  return result;
}
