/**
 * Anti-AI Humanization & Burstiness Engine
 * 
 * Comprehensive 25-Rule AI Cleanup & Humanizer based on empirical Wikipedia & Detector Patterns:
 * 
 * A. Staging instead of stating
 * 1. Not X but Y (§1)
 * 2. One-line closers and dramatic fragments (§2)
 * 3. Sayings that sound deep (§3)
 * 4. Staged run-up before the point (§4)
 * 5. Arguing with no one (§5)
 * 
 * B. Rhythm by rule
 * 6. Forced triads (§6)
 * 7. Repeated sentence openings (§7)
 * 8. Dashes as universal connector (§8) - STRICTLY NO EM/EN DASHES in final rewrite
 * 9. Stacked qualifiers (§9)
 * 10. Hyphenated pairs everywhere (§10)
 * 11. Passive voice and missing subjects (§11)
 * 
 * C. Inflation and borrowed authority
 * 12. Overused AI words (§12)
 * 13. Inflated significance (§13)
 * 14. Vague connection or association (§14)
 * 15. Shallow -ing riders (§15)
 * 16. Sales language (§16)
 * 17. Borrowed authority (§17)
 * 18. Avoiding is, are, and has (§18)
 * 
 * D. Formatting by rule
 * 19. Bold as decoration (§19)
 * 20. Decorative headings (§20)
 * 21. Curly quotation marks (§21)
 * 
 * E. Leftovers from the chat and the draft
 * 22. Chatbot residue (§22)
 * 23. Knowledge-limit disclaimers and guesses (§23)
 * 24. A heading repeated in the first sentence (§24)
 * 25. Writing about the previous version (§25)
 */

import { ToneStyle } from '../types';
import { lockStatisticalAndAcademicExpressions } from './entityProtection';

/**
 * AI "Tell" Cliché Words and their direct, natural human replacements.
 * Covering §12, §13, §14, §16, §18 of the specification.
 */
export const AI_VOCABULARY_MAP: Record<string, { replacements: string[]; pattern: RegExp }> = {
  // §12: Overused AI words
  'delve deeper into': {
    replacements: ['examine further', 'look closer at', 'explore further'],
    pattern: /\bdelve\s+deeper\s+into\b/gi,
  },
  'delve into': {
    replacements: ['examine', 'explore', 'look into', 'investigate', 'study'],
    pattern: /\bdelve\s+into\b/gi,
  },
  'delving into': {
    replacements: ['examining', 'exploring', 'investigating', 'studying'],
    pattern: /\bdelving\s+into\b/gi,
  },
  'delves into': {
    replacements: ['examines', 'explores', 'investigates', 'studies'],
    pattern: /\bdelves\s+into\b/gi,
  },
  'delve': {
    replacements: ['examine', 'investigate', 'explore', 'study'],
    pattern: /\bdelve\b/gi,
  },
  'actually': {
    replacements: ['', 'in practice', 'in fact'],
    pattern: /\bactually,?\b/gi,
  },
  'additionally': {
    replacements: ['also', 'and', 'further', ''],
    pattern: /\badditionally,?\b/gi,
  },
  'align with': {
    replacements: ['match', 'fit', 'accord with', 'support'],
    pattern: /\balign(?:s|ed|ing)?\s+with\b/gi,
  },
  'bolstered': {
    replacements: ['supported', 'reinforced', 'backed', 'strengthened'],
    pattern: /\bbolstered\b/gi,
  },
  'bolster': {
    replacements: ['support', 'reinforce', 'strengthen'],
    pattern: /\bbolster(?:s|ing)?\b/gi,
  },
  'crucial': {
    replacements: ['essential', 'important', 'necessary', 'needed'],
    pattern: /\bcrucial\b/gi,
  },
  'deep dive': {
    replacements: ['detailed analysis', 'thorough review', 'close study'],
    pattern: /\b(?:a\s+)?deep\s+dive(?:\s+into)?\b/gi,
  },
  'emphasizing': {
    replacements: ['noting', 'stressing', 'pointing out'],
    pattern: /\bemphasizing\b/gi,
  },
  'enduring': {
    replacements: ['lasting', 'continuing', 'persistent'],
    pattern: /\benduring\b/gi,
  },
  'enhancing': {
    replacements: ['improving', 'increasing', 'refining'],
    pattern: /\benhancing\b/gi,
  },
  'enhance': {
    replacements: ['improve', 'strengthen', 'raise'],
    pattern: /\benhance(?:s|d)?\b/gi,
  },
  'fostering': {
    replacements: ['encouraging', 'supporting', 'promoting', 'developing'],
    pattern: /\bfostering\b/gi,
  },
  'foster': {
    replacements: ['encourage', 'support', 'promote', 'develop'],
    pattern: /\bfoster(?:s|ed)?\b/gi,
  },
  'garner': {
    replacements: ['receive', 'obtain', 'collect', 'gain'],
    pattern: /\bgarner(?:s|ed|ing)?\b/gi,
  },
  'highlight': {
    replacements: ['show', 'note', 'indicate', 'point out'],
    pattern: /\bhighlights?\b/gi,
  },
  'highlighted': {
    replacements: ['showed', 'noted', 'indicated', 'found'],
    pattern: /\bhighlighted\b/gi,
  },
  'highlighting': {
    replacements: ['showing', 'noting', 'indicating'],
    pattern: /\bhighlighting\b/gi,
  },
  'intricate interplay': {
    replacements: ['interaction', 'connection', 'relationship'],
    pattern: /\b(?:the|an?)\s+intricate\s+interplay\b/gi,
  },
  'interplay': {
    replacements: ['interaction', 'relationship', 'connection'],
    pattern: /\binterplay\b/gi,
  },
  'intricate': {
    replacements: ['complex', 'detailed', 'elaborate'],
    pattern: /\bintricate\b/gi,
  },
  'intricacies': {
    replacements: ['details', 'complexities', 'nuances'],
    pattern: /\bintricacies\b/gi,
  },
  'key role': {
    replacements: ['central role', 'major role', 'main role', 'direct influence'],
    pattern: /\b(?:a\s+)?key\s+role\b/gi,
  },
  'pivotal role': {
    replacements: ['central role', 'major role', 'main influence'],
    pattern: /\b(?:a\s+)?pivotal\s+role\b/gi,
  },
  'pivotal': {
    replacements: ['central', 'major', 'critical', 'primary'],
    pattern: /\bpivotal\b/gi,
  },
  'technological landscape': {
    replacements: ['technology sector', 'tech industry', 'technology systems'],
    pattern: /\btechnological\s+landscape\b/gi,
  },
  'ever-evolving landscape': {
    replacements: ['changing environment', 'evolving field', 'current context'],
    pattern: /\b(?:an?\s+)?ever-evolving\s+landscape\b/gi,
  },
  'evolving landscape': {
    replacements: ['changing environment', 'evolving field', 'sector'],
    pattern: /\b(?:the|an?)\s+evolving\s+landscape\b/gi,
  },
  'dynamic landscape': {
    replacements: ['active environment', 'changing market', 'industry'],
    pattern: /\b(?:the|a)\s+dynamic\s+landscape\b/gi,
  },
  'landscape': {
    replacements: ['environment', 'domain', 'field', 'area', 'context'],
    pattern: /\blandscape\b/gi,
  },
  'meticulously': {
    replacements: ['carefully', 'thoroughly', 'systematically', 'closely'],
    pattern: /\bmeticulously\b/gi,
  },
  'meticulous': {
    replacements: ['careful', 'thorough', 'systematic', 'detailed'],
    pattern: /\bmeticulous\b/gi,
  },
  'quietly': {
    replacements: ['gradually', 'consistently', 'steadily', ''],
    pattern: /\bquietly\b/gi,
  },
  'robust': {
    replacements: ['strong', 'reliable', 'solid', 'rigorous', 'sound'],
    pattern: /\brobust\b/gi,
  },
  'showcase': {
    replacements: ['show', 'demonstrate', 'present', 'display'],
    pattern: /\bshowcase(?:s|d|ing)?\b/gi,
  },
  'rich tapestry': {
    replacements: ['complex mix', 'broad range', 'combination', 'diversity'],
    pattern: /\b(?:a\s+)?rich\s+tapestry(?:\s+of)?\b/gi,
  },
  'tapestry': {
    replacements: ['mix', 'blend', 'combination', 'collection'],
    pattern: /\btapestry\b/gi,
  },
  'stand as a testament to': {
    replacements: ['demonstrate', 'show', 'reflect', 'confirm'],
    pattern: /\bstands?\s+as\s+a\s+testament\s+to\b/gi,
  },
  'stand as a testament': {
    replacements: ['provide evidence', 'demonstrate', 'show'],
    pattern: /\bstands?\s+as\s+a\s+testament\b/gi,
  },
  'testament to': {
    replacements: ['evidence of', 'sign of', 'proof of', 'demonstration of'],
    pattern: /\b(?:a\s+)?testament\s+to\b/gi,
  },
  'testament': {
    replacements: ['evidence', 'proof', 'sign', 'indication'],
    pattern: /\btestament\b/gi,
  },
  'underscores its importance': {
    replacements: ['shows its relevance', 'highlights its necessity', 'matters'],
    pattern: /\bunderscores?\s+its\s+importance\b/gi,
  },
  'underscored the paramount importance': {
    replacements: ['showed the need for', 'highlighted the necessity of'],
    pattern: /\bunderscored?\s+the\s+paramount\s+importance(?:\s+of)?\b/gi,
  },
  'paramount importance': {
    replacements: ['high priority', 'primary need', 'importance'],
    pattern: /\bparamount\s+importance\b/gi,
  },
  'paramount': {
    replacements: ['primary', 'essential', 'top priority'],
    pattern: /\bparamount\b/gi,
  },
  'underscores': {
    replacements: ['highlights', 'indicates', 'shows', 'stresses'],
    pattern: /\bunderscores\b/gi,
  },
  'underscored': {
    replacements: ['highlighted', 'indicated', 'showed', 'stressed'],
    pattern: /\bunderscored\b/gi,
  },
  'underscore': {
    replacements: ['highlight', 'indicate', 'show', 'stress'],
    pattern: /\bunderscore\b/gi,
  },
  'underscoring': {
    replacements: ['highlighting', 'showing', 'indicating'],
    pattern: /\bunderscoring\b/gi,
  },
  'valuable': {
    replacements: ['useful', 'informative', 'helpful', 'relevant'],
    pattern: /\bvaluable\b/gi,
  },
  'vibrant': {
    replacements: ['active', 'growing', 'lively', 'busy'],
    pattern: /\bvibrant\b/gi,
  },

  // §13: Inflated significance
  'indelible mark': {
    replacements: ['lasting influence', 'significant effect', 'impact'],
    pattern: /\b(?:an?\s+)?indelible\s+mark\b/gi,
  },
  'setting the stage for': {
    replacements: ['leading to', 'enabling', 'allowing'],
    pattern: /\bsetting\s+the\s+stage\s+for\b/gi,
  },
  'sets the stage for': {
    replacements: ['leads to', 'enables', 'prepares'],
    pattern: /\bsets\s+the\s+stage\s+for\b/gi,
  },
  'reflects a broader': {
    replacements: ['indicates a wider', 'aligns with general', 'mirrors'],
    pattern: /\breflects\s+a\s+broader\b/gi,
  },
  'a step in the right direction': {
    replacements: ['practical progress', 'an improvement', 'a solid gain'],
    pattern: /\ba\s+step\s+in\s+the\s+right\s+direction\b/gi,
  },
  'the future looks bright': {
    replacements: ['prospects remain positive', 'growth continues'],
    pattern: /\bthe\s+future\s+looks\s+bright\b/gi,
  },
  'exciting times ahead': {
    replacements: ['further developments follow', 'subsequent work continues'],
    pattern: /\bexciting\s+times\s+ahead\b/gi,
  },

  // §16: Sales language
  'groundbreaking': {
    replacements: ['notable', 'new', 'innovative', 'significant'],
    pattern: /\bgroundbreaking\b/gi,
  },
  'revolutionized': {
    replacements: ['fundamentally changed', 'altered', 'reformed', 'shifted'],
    pattern: /\brevolutionized\b/gi,
  },
  'revolutionize': {
    replacements: ['change', 'alter', 'reform', 'transform'],
    pattern: /\brevolutionize\b/gi,
  },
  'exemplifies': {
    replacements: ['illustrates', 'shows', 'represents'],
    pattern: /\bexemplifies\b/gi,
  },
  'beacon': {
    replacements: ['guide', 'model', 'reference point'],
    pattern: /\bbeacon\b/gi,
  },
  'profound': {
    replacements: ['deep', 'substantial', 'marked', 'notable'],
    pattern: /\bprofound\b/gi,
  },
  'breathtaking': {
    replacements: ['impressive', 'notable', 'striking'],
    pattern: /\bbreathtaking\b/gi,
  },
  'stunning': {
    replacements: ['striking', 'distinct', 'clear'],
    pattern: /\bstunning\b/gi,
  },
  'diverse array': {
    replacements: ['wide range', 'variety', 'mix'],
    pattern: /\b(?:a\s+)?diverse\s+array(?:\s+of)?\b/gi,
  },
  'plethora of': {
    replacements: ['many', 'numerous', 'various', 'broad range of'],
    pattern: /\b(?:a\s+)?plethora\s+of\b/gi,
  },
  'myriad of': {
    replacements: ['many', 'numerous', 'several'],
    pattern: /\b(?:a\s+)?myriad\s+of\b/gi,
  },
  'multifaceted': {
    replacements: ['complex', 'varied', 'diverse'],
    pattern: /\bmultifaceted\b/gi,
  },
  'seamlessly': {
    replacements: ['smoothly', 'directly', 'easily'],
    pattern: /\bseamlessly\b/gi,
  },

  // Common robotic transitional openers
  'furthermore': {
    replacements: ['also', 'in addition', 'and', ''],
    pattern: /\bfurthermore,?\b/gi,
  },
  'moreover': {
    replacements: ['also', 'and', 'further', ''],
    pattern: /\bmoreover,?\b/gi,
  },
  'in conclusion': {
    replacements: ['overall,', 'in summary,', 'ultimately,'],
    pattern: /\bin\s+conclusion,?\b/gi,
  },
  'in light of these findings': {
    replacements: ['given these findings', 'based on these results', 'accordingly'],
    pattern: /\bin\s+light\s+of\s+these\s+findings,?\b/gi,
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
 * §1: Eliminate "Not X but Y" constructions.
 * States the claim directly rather than staging a rhetorical contrast.
 */
export function rule1_eliminateNotXButY(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Pattern: "It is not just/only/merely X, but Y." -> "Y."
  // e.g. "It is not just a tool, but a mirror reflecting human ambition." -> "It reflects human ambition."
  const toolMirror = /(?:it\s+is\s+|it's\s+)?not\s+(?:just|only|merely)\s+a\s+tool,?\s+but\s+(?:a\s+)?mirror\s+reflecting\s+([^.]+)/gi;
  if (toolMirror.test(modified)) {
    modified = modified.replace(toolMirror, 'it directly reflects $1');
    applied = true;
  }

  // General "not only/just/merely X, but (also) Y" -> "Y"
  const notOnlyRegex = /\b(?:it\s+is\s+|it's\s+)?not\s+(?:just|only|merely)\s+([^,;]+?),\s*but\s+(?:also\s+)?(?:it\s+(?:is\s+)?)?([^.]+)/gi;
  if (notOnlyRegex.test(modified)) {
    modified = modified.replace(notOnlyRegex, (match, x, y) => {
      applied = true;
      const cleanY = y.trim();
      return cleanY.charAt(0).toUpperCase() + cleanY.slice(1);
    });
  }

  // "This does not mean X. It means Y." -> "Y."
  const splitNotX = /this\s+does\s+not\s+mean\s+[^.]+\.\s*it\s+means\s+([^.]+)/gi;
  if (splitNotX.test(modified)) {
    modified = modified.replace(splitNotX, (match, y) => {
      applied = true;
      const cleanY = y.trim();
      return cleanY.charAt(0).toUpperCase() + cleanY.slice(1);
    });
  }

  // Negative tails: ", no guessing.", ", no hesitation." -> "."
  const negativeTail = /,\s*no\s+(?:guessing|hesitation|compromise|doubt)\b/gi;
  if (negativeTail.test(modified)) {
    modified = modified.replace(negativeTail, '');
    applied = true;
  }

  return { text: modified, applied };
}

/**
 * §2: Clean one-line closers and dramatic fragments.
 * Merges staccato fragments into complete sentences and removes vacuous one-line summaries.
 */
export function rule2_cleanClosersAndDramaticFragments(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Vacuous closers
  const closerRegex = /(?:^|\n)(?:That is the real win\.|Read that again\.|Let that sink in\.|And that changes everything\.|The rest is history\.)(?:\n|$)/gim;
  if (closerRegex.test(modified)) {
    modified = modified.replace(closerRegex, '\n');
    applied = true;
  }

  // Dramatic fragments: "No aesthetic prior. No nostalgia for human taste." -> "without aesthetic priors or nostalgia for human taste."
  const fragmentPair = /([A-Za-z0-9_]+)\s+arrived\.\s*No\s+([^.]+?)\.\s*No\s+([^.]+?)\./gi;
  if (fragmentPair.test(modified)) {
    modified = modified.replace(fragmentPair, '$1 arrived without $2 or $3.');
    applied = true;
  }

  // Generic consecutive "No X. No Y."
  const genericNoPair = /(^|[.!?]\s+)No\s+([^.]+?)\.\s*No\s+([^.]+?)\./gi;
  if (genericNoPair.test(modified)) {
    modified = modified.replace(genericNoPair, '$1The system had no $2 and no $3.');
    applied = true;
  }

  // Spaced periods: "every. single. day." -> "every single day"
  const spacedPeriods = /\b([a-zA-Z]+)\.\s+([a-zA-Z]+)\.\s+([a-zA-Z]+)\./g;
  if (spacedPeriods.test(modified)) {
    modified = modified.replace(spacedPeriods, '$1 $2 $3.');
    applied = true;
  }

  return { text: modified, applied };
}

/**
 * §3: Replace sayings that sound deep with concrete claims.
 */
export function rule3_replaceDeepSoundingSayings(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const deepPatterns = [
    { pattern: /\bthe\s+real\s+question\s+is\s+whether\s+([^,;]+),\s*and\s+at\s+its\s+core,\s*what\s+really\s+matters\s+is\s+([^.]+)/gi, rep: 'whether $1 depends primarily on $2' },
    { pattern: /\bthe\s+real\s+question\s+is\s+(?:whether\s+)?/gi, rep: 'the primary consideration is ' },
    { pattern: /\bat\s+its\s+core,?\s*/gi, rep: '' },
    { pattern: /\bwhat\s+really\s+matters\s+is\s+/gi, rep: 'the critical factor is ' },
    { pattern: /\bthe\s+deeper\s+issue\s+(?:is\s+)?/gi, rep: 'the underlying challenge is ' },
    { pattern: /\bthe\s+heart\s+of\s+the\s+matter\s+(?:is\s+)?/gi, rep: 'the main issue is ' },
    { pattern: /\bfundamentally,?\s*/gi, rep: '' },
    { pattern: /\bin\s+reality,?\s*/gi, rep: 'in practice, ' },
    { pattern: /\bthe\s+architecture\s+of\s+shaping\b/gi, rep: 'how to shape' },
    { pattern: /\bthe\s+currency\s+of\s+([a-zA-Z]+)\b/gi, rep: 'how $1 operates' },
    { pattern: /\bthe\s+language\s+of\s+([a-zA-Z]+)\b/gi, rep: 'how $1 is expressed' },
    { pattern: /\bbecomes?\s+a\s+trap\b/gi, rep: 'creates persistent friction' },
  ];

  for (const item of deepPatterns) {
    if (item.pattern.test(modified)) {
      modified = modified.replace(item.pattern, item.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §4: Remove staged run-up before the point.
 */
export function rule4_stripStagedRunUp(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const runUps = [
    /(^|[.!?]\s+)(?:Let's\s+dive\s+in|let's\s+explore|let's\s+break\s+this\s+down|here's\s+what\s+you\s+need\s+to\s+know|now\s+let's\s+look\s+at|without\s+further\s+ado|heads\s+up|quick\s+note)[,:]?\s*/gi,
    /(^|[.!?]\s+)(?:Honestly\?|Look,|Here's\s+the\s+thing:?|The\s+thing\s+is:?|Let's\s+be\s+honest,|Real\s+talk,)\s*/gi,
    /(^|[.!?]\s+)one\s+thing\s+that\s+bit\s+me[^.]*?pay\s+attention:?\s*/gi,
  ];

  for (const r of runUps) {
    if (r.test(modified)) {
      modified = modified.replace(r, (m, p1) => {
        applied = true;
        return p1 ? `${p1} ` : '';
      });
    }
  }

  return { text: modified, applied };
}

/**
 * §5: Remove arguing with no one (preemptive self-defense).
 */
export function rule5_removeArguingWithNoOne(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const defensePatterns = [
    /(^|[.!?]\s+)(?:This\s+isn't\s+(?:mainly\s+)?about|I'm\s+not\s+saying\s+(?:that\s+)?|To\s+be\s+clear,\s*|Don't\s+get\s+me\s+wrong,\s*|This\s+is\s+not\s+to\s+say\s+(?:that\s+)?)\s*/gi,
    /(^|[.!?]\s+)(?:A\s+tempting\s+approach\s+would\s+be\s+to|One\s+might\s+be\s+tempted\s+to|An\s+obvious\s+approach\s+would\s+be\s+to|It\s+would\s+be\s+easy\s+to\s+just)\s*([^.]+)\.\s*However,?\s*/gi,
  ];

  for (const dp of defensePatterns) {
    if (dp.test(modified)) {
      modified = modified.replace(dp, (m, p1) => {
        applied = true;
        return p1 ? `${p1} ` : '';
      });
    }
  }

  return { text: modified, applied };
}

/**
 * §6: Smooth forced triads.
 * Replaces canned 3-part marketing triads.
 */
export function rule6_smoothForcedTriads(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const cannedTriads = [
    { pattern: /\binnovation,\s+inspiration,\s+and\s+insights\b/gi, rep: 'innovation and practical insights' },
    { pattern: /\bclarity,\s+consistency,\s+and\s+collaboration\b/gi, rep: 'clarity and team collaboration' },
    { pattern: /\befficiency,\s+agility,\s+and\s+resilience\b/gi, rep: 'operational efficiency' },
  ];

  for (const t of cannedTriads) {
    if (t.pattern.test(modified)) {
      modified = modified.replace(t.pattern, t.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §7: Diversify repeated sentence openings.
 * Avoids starting 2 or more consecutive sentences with the identical subject or pronoun.
 */
export function rule7_diversifyRepeatedOpenings(sentences: string[]): string[] {
  if (sentences.length <= 1) return sentences;
  const result: string[] = [...sentences];

  for (let i = 1; i < result.length; i++) {
    const prev = result[i - 1].trim();
    const curr = result[i].trim();

    const prevWords = prev.split(/\s+/).slice(0, 2).map((w) => w.toLowerCase());
    const currWords = curr.split(/\s+/).slice(0, 2).map((w) => w.toLowerCase());

    if (prevWords.length >= 2 && currWords.length >= 2 && prevWords[0] === currWords[0] && prevWords[1] === currWords[1]) {
      // Invert or front an adverbial bridge to break monotony
      if (curr.startsWith('The ')) {
        result[i] = curr.replace(/^The\s+([^,]+?)\s+(showed|demonstrated|found|analyzed)\s+([^.]+)/i, (m, subj, verb, rest) => {
          return `In this context, the ${subj} ${verb} ${rest}`;
        });
      } else if (curr.startsWith('She ') || curr.startsWith('He ') || curr.startsWith('They ')) {
        result[i] = curr.replace(/^([A-Za-z]+)\s+([a-z]+ed)\s+([^.]+)/i, (m, subj, verb, rest) => {
          return `Subsequently, ${subj.toLowerCase()} ${verb} ${rest}`;
        });
      }
    }
  }

  return result;
}

/**
 * §8: Dashes as the universal connector.
 * STRICT MANDATE: "The final rewrite MUST NOT contain em dashes (—) or en dashes (–) or double hyphens ( -- )."
 * Replaces each dash with a period, comma, colon, or parentheses.
 */
export function rule8_eliminateAllDashes(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Check for em dash (—), en dash (–), or spaced double hyphen ( -- )
  const hasDashes = /[—–]|(?:\s+--\s+)/.test(modified);
  if (!hasDashes) return { text, applied: false };

  // 1. Parenthetical dash pair: "text — explanation — text" -> "text (explanation) text"
  modified = modified.replace(/\s*[—–]\s*([^—–\n]+?)\s*[—–]\s*/g, (match, inner) => {
    applied = true;
    return ` (${inner.trim()}) `;
  });

  // 2. Single trailing dash: "text — result." -> "text: result." or "text, result."
  modified = modified.replace(/\s*[—–]\s*/g, (match) => {
    applied = true;
    return ', ';
  });

  // 3. Spaced double hyphen
  modified = modified.replace(/\s+--\s+/g, () => {
    applied = true;
    return ', ';
  });

  // Clean spacing around commas
  modified = modified.replace(/\s+,/g, ',').replace(/,\s*,/g, ',');

  return { text: modified, applied };
}

/**
 * §9: Stacked qualifiers.
 * Collapses stacked hedging ("could potentially possibly", "might arguably").
 */
export function rule9_simplifyStackedQualifiers(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const qualifiers = [
    { pattern: /\bcould\s+potentially\s+possibly\b/gi, rep: 'may' },
    { pattern: /\bcould\s+potentially\b/gi, rep: 'may' },
    { pattern: /\bmight\s+arguably\s+be\b/gi, rep: 'may be' },
    { pattern: /\bmight\s+arguably\b/gi, rep: 'might' },
    { pattern: /\barguably\s+could\b/gi, rep: 'could' },
    { pattern: /\bto\s+be\s+fair,?\s*(?:it's|it\s+is)\s+also\s+possible\s+that\b/gi, rep: 'also,' },
    { pattern: /\bin\s+some\s+cases\s+it\s+may\s+(?:potentially\s+)?/gi, rep: 'it may ' },
  ];

  for (const q of qualifiers) {
    if (q.pattern.test(modified)) {
      modified = modified.replace(q.pattern, q.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §10: Hyphenated pairs everywhere.
 * Drops artificial hyphens when used predicatively or simplifies them.
 */
export function rule10_normalizeHyphenatedPairs(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Drop hyphens when after a verb (e.g. "is high-quality" -> "is high quality")
  const predicativePairs = [
    { pattern: /\b(?:is|was|are|were|remains?)\s+high-quality\b/gi, rep: '$&'.replace('high-quality', 'high quality') },
    { pattern: /\b(?:is|was|are|were|remains?)\s+real-time\b/gi, rep: '$&'.replace('real-time', 'in real time') },
    { pattern: /\bdata-driven\s+evaluation\b/gi, rep: 'empirical evaluation' },
  ];

  for (const p of predicativePairs) {
    if (p.pattern.test(modified)) {
      modified = modified.replace(p.pattern, p.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §11: Passive voice and missing subjects.
 * Reconstructs truncated agentless clauses.
 */
export function rule11_resolvePassiveMissingSubjects(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const missingSubjects = [
    { pattern: /(^|[.!?]\s+)No\s+configuration\s+file\s+needed\.\s*The\s+results\s+are\s+preserved\s+automatically\./gi, rep: '$1You do not need a configuration file; the system preserves results automatically.' },
    { pattern: /(^|[.!?]\s+)No\s+setup\s+required\./gi, rep: '$1Setup is automatic.' },
  ];

  for (const ms of missingSubjects) {
    if (ms.pattern.test(modified)) {
      modified = modified.replace(ms.pattern, ms.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §14: Vague connection or association.
 * States the exact relationship.
 */
export function rule14_clarifyVagueConnections(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Replace vague "in connection with" when not statistical
  const vague = [
    { pattern: /\bin\s+association\s+with\b/gi, rep: 'alongside' },
    { pattern: /\bin\s+connection\s+with\b/gi, rep: 'related to' },
  ];

  for (const v of vague) {
    if (v.pattern.test(modified)) {
      modified = modified.replace(v.pattern, v.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §15: Shallow -ing riders.
 * Strips superficial participle riders tacked onto sentence ends.
 */
export function rule15_stripShallowIngRiders(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Trailing ", highlighting/underscoring/emphasizing/fostering/ensuring/reflecting/symbolizing/showcasing X."
  const shallowRider = /,\s*(?:highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing\s+to|cultivating|fostering|encompassing|showcasing)\s+[^.]+([.!?])/gi;
  if (shallowRider.test(modified)) {
    modified = modified.replace(shallowRider, '$1');
    applied = true;
  }

  return { text: modified, applied };
}

/**
 * §17: Borrowed authority.
 * Cleans false attribution / vague consensus.
 */
export function rule17_stripBorrowedAuthority(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const authority = [
    { pattern: /(^|[.!?]\s+)(?:industry\s+reports\s+suggest\s+that|some\s+critics\s+claim\s+that|observers\s+have\s+cited\s+that)\s*/gi, rep: '$1Reports indicate that ' },
    { pattern: /(^|[.!?]\s+)experts\s+argue\s+that\s*/gi, rep: '$1Researchers observe that ' },
  ];

  for (const a of authority) {
    if (a.pattern.test(modified)) {
      modified = modified.replace(a.pattern, a.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §18: Avoiding is, are, and has.
 * Replaces artificial copula avoiders ("serves as", "stands as", "functions as") with natural is/are/has.
 */
export function rule18_restoreIsAreHas(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const copulaMap = [
    { pattern: /\bserves?\s+as\s+(?:an?\s+)?/gi, rep: 'is ' },
    { pattern: /\bstands?\s+as\s+(?:an?\s+)?/gi, rep: 'is ' },
    { pattern: /\bfunctions?\s+as\s+(?:an?\s+)?/gi, rep: 'is ' },
    { pattern: /\boperates?\s+as\s+(?:an?\s+)?/gi, rep: 'is ' },
    { pattern: /\brepresents?\s+an?\s+/gi, rep: 'is ' },
    { pattern: /\bfeatures?\s+an?\s+/gi, rep: 'has ' },
    { pattern: /\bboasts?\s+an?\s+/gi, rep: 'has ' },
    { pattern: /\bboasts?\s+/gi, rep: 'has ' },
  ];

  for (const c of copulaMap) {
    if (c.pattern.test(modified)) {
      modified = modified.replace(c.pattern, c.rep);
      applied = true;
    }
  }

  return { text: modified, applied };
}

/**
 * §19: Bold as decoration.
 * Strips arbitrary markdown bolding (`**bold**`).
 */
export function rule19_stripDecorativeBolding(text: string): { text: string; applied: boolean } {
  const hasBold = /\*\*[^*]+\*\*/.test(text);
  if (!hasBold) return { text, applied: false };
  const cleaned = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  return { text: cleaned, applied: true };
}

/**
 * §20: Decorative headings.
 * Removes decorative emojis, arrows, and dividers.
 */
export function rule20_cleanDecorativeHeadings(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  // Strip emojis from headings or text
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
  if (emojiRegex.test(modified)) {
    modified = modified.replace(emojiRegex, '');
    applied = true;
  }

  // Strip decorative arrows (→, ➔, ➜)
  if (/[→➔➜]/.test(modified)) {
    modified = modified.replace(/[→➔➜]\s*/g, '');
    applied = true;
  }

  // Strip arbitrary horizontal rules
  if (/(?:^|\n)\s*---+\s*(?:\n|$)/g.test(modified)) {
    modified = modified.replace(/(?:^|\n)\s*---+\s*(?:\n|$)/g, '\n');
    applied = true;
  }

  return { text: modified.trim(), applied };
}

/**
 * §21: Curly quotation marks.
 * Converts curly quotes (“...”, ‘...’) to straight ASCII quotes ("...", '...').
 */
export function rule21_convertCurlyQuotes(text: string): { text: string; applied: boolean } {
  const hasCurly = /[“”‘’]/.test(text);
  if (!hasCurly) return { text, applied: false };

  const cleaned = text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  return { text: cleaned, applied: true };
}

/**
 * §22: Chatbot residue.
 * Strips conversational filler and assistant boilerplate.
 */
export function rule22_stripChatbotResidue(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const residuePatterns = [
    /(?:^|\n)\s*(?:I\s+hope\s+this\s+helps[!.?]?|Of\s+course[!]?|Certainly[!]?|Great\s+question[!]?|You're\s+absolutely\s+right[!]?)\s*(?:\n|$)/gi,
    /(?:^|\n)\s*(?:Would\s+you\s+like\s+me\s+to[^.?\n]*[?.]?|Want\s+me\s+to[^.?\n]*[?.]?|Should\s+I\s+continue[?.]?|Let\s+me\s+know\s+if\s+you\s+need[^.?\n]*[?.]?)\s*(?:\n|$)/gi,
    /(?:^|\n)\s*(?:Here\s+is\s+a\s+(?:breakdown|summary|rewrite|paraphrase)[^:\n]*:?)\s*(?:\n|$)/gi,
  ];

  for (const rp of residuePatterns) {
    if (rp.test(modified)) {
      modified = modified.replace(rp, '\n');
      applied = true;
    }
  }

  return { text: modified.trim(), applied };
}

/**
 * §23: Knowledge-limit disclaimers and guesses.
 * Removes AI time-limit disclaimers.
 */
export function rule23_removeKnowledgeDisclaimers(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const disclaimers = [
    /(?:^|[.!?]\s+)(?:as\s+of\s+(?:my\s+last\s+update|2023|2024|2025|2026),?\s*|up\s+to\s+my\s+last\s+training\s+update,?\s*)/gi,
    /(?:^|[.!?]\s+)while\s+specific\s+details\s+are\s+limited,?\s*/gi,
    /(?:^|[.!?]\s+)based\s+on\s+available\s+information,?\s*/gi,
    /(?:^|[.!?]\s+)in\s+the\s+(?:provided|available)\s+sources,?\s*/gi,
  ];

  for (const d of disclaimers) {
    if (d.pattern.test(modified)) {
      modified = modified.replace(d.pattern, (m, p1) => {
        applied = true;
        return p1 ? `${p1} ` : '';
      });
    }
  }

  return { text: modified, applied };
}

/**
 * §24: Heading repeated in first sentence.
 * Removes redundant first sentences that merely repeat the heading name.
 */
export function rule24_removeRepeatedHeadingSentences(text: string, headingText?: string): { text: string; applied: boolean } {
  if (!headingText) return { text, applied: false };
  const cleanHeading = headingText.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (!cleanHeading) return { text, applied: false };

  // e.g. Heading: "Methodology", first sentence: "This section details the methodology."
  const firstSentenceMatch = text.match(/^([^.!?]+[.!?])/);
  if (firstSentenceMatch) {
    const firstSent = firstSentenceMatch[1].toLowerCase();
    if (firstSent.includes(cleanHeading) && (firstSent.includes('this section') || firstSent.includes('this chapter') || firstSent.includes('below are'))) {
      const remaining = text.slice(firstSentenceMatch[0].length).trim();
      return { text: remaining, applied: true };
    }
  }

  return { text, applied: false };
}

/**
 * §25: Writing about the previous version.
 * Cleans metadata referring to earlier drafts.
 */
export function rule25_removePreviousVersionMentions(text: string): { text: string; applied: boolean } {
  let modified = text;
  let applied = false;

  const versionPatterns = [
    /(?:^|[.!?]\s+)(?:This\s+function\s+was\s+added\s+to\s+replace\s+the\s+previous\s+approach[^.]*\.\s*)/gi,
    /(?:^|[.!?]\s+)(?:Unlike\s+the\s+previous\s+version,?\s*)/gi,
  ];

  for (const vp of versionPatterns) {
    if (vp.test(modified)) {
      modified = modified.replace(vp, (m, p1) => {
        applied = true;
        return p1 ? `${p1} ` : '';
      });
    }
  }

  return { text: modified, applied };
}

/**
 * Master Humanizer Engine: Applies all 25 Wikipedia Anti-AI rules deterministically.
 */
export function humanizeText25Rules(
  text: string,
  tone: ToneStyle = 'academic',
  headingText?: string
): { transformedText: string; appliedRulesCount: number; rulesApplied: string[] } {
  // Lock all statistical notations, parentheticals, citations, and decimal values
  const { lockedText, restore } = lockStatisticalAndAcademicExpressions(text);
  let result = lockedText;
  const rulesApplied: string[] = [];
  let count = 0;

  // §21: Curly quotes
  const r21 = rule21_convertCurlyQuotes(result);
  if (r21.applied) {
    result = r21.text;
    count++;
    rulesApplied.push('Rule 21: Converted curly quotes to standard straight quotation marks');
  }

  // §19: Bold decoration
  const r19 = rule19_stripDecorativeBolding(result);
  if (r19.applied) {
    result = r19.text;
    count++;
    rulesApplied.push('Rule 19: Removed decorative inline bolding');
  }

  // §20: Decorative headings & emojis
  const r20 = rule20_cleanDecorativeHeadings(result);
  if (r20.applied) {
    result = r20.text;
    count++;
    rulesApplied.push('Rule 20: Purged decorative emojis, arrows, and divider rules');
  }

  // §22: Chatbot residue
  const r22 = rule22_stripChatbotResidue(result);
  if (r22.applied) {
    result = r22.text;
    count++;
    rulesApplied.push('Rule 22: Stripped chatbot conversational residue');
  }

  // §23: Knowledge-limit disclaimers
  const r23 = rule23_removeKnowledgeDisclaimers(result);
  if (r23.applied) {
    result = r23.text;
    count++;
    rulesApplied.push('Rule 23: Removed knowledge-cutoff boilerplate');
  }

  // §24: Heading repeated in first sentence
  const r24 = rule24_removeRepeatedHeadingSentences(result, headingText);
  if (r24.applied) {
    result = r24.text;
    count++;
    rulesApplied.push('Rule 24: Removed redundant heading echo in opening sentence');
  }

  // §25: Previous version mentions
  const r25 = rule25_removePreviousVersionMentions(result);
  if (r25.applied) {
    result = r25.text;
    count++;
    rulesApplied.push('Rule 25: Removed meta-commentary on previous versions');
  }

  // §4: Staged run-up
  const r4 = rule4_stripStagedRunUp(result);
  if (r4.applied) {
    result = r4.text;
    count++;
    rulesApplied.push('Rule 4: Stripped staged conversational run-up before points');
  }

  // §5: Arguing with no one
  const r5 = rule5_removeArguingWithNoOne(result);
  if (r5.applied) {
    result = r5.text;
    count++;
    rulesApplied.push('Rule 5: Removed preemptive self-defensive phrasing');
  }

  // §1: Not X but Y
  const r1 = rule1_eliminateNotXButY(result);
  if (r1.applied) {
    result = r1.text;
    count++;
    rulesApplied.push('Rule 1: Converted "Not X but Y" staging into direct statement');
  }

  // §2: Closers and dramatic fragments
  const r2 = rule2_cleanClosersAndDramaticFragments(result);
  if (r2.applied) {
    result = r2.text;
    count++;
    rulesApplied.push('Rule 2: Merged dramatic fragments and eliminated vacuous closers');
  }

  // §3: Sayings that sound deep
  const r3 = rule3_replaceDeepSoundingSayings(result);
  if (r3.applied) {
    result = r3.text;
    count++;
    rulesApplied.push('Rule 3: Replaced deep-sounding AI proverbs with concrete claims');
  }

  // §8: Dashes as universal connector (STRICT MANDATE)
  const r8 = rule8_eliminateAllDashes(result);
  if (r8.applied) {
    result = r8.text;
    count++;
    rulesApplied.push('Rule 8: Eliminated all em/en dashes and restructured connectors');
  }

  // §9: Stacked qualifiers
  const r9 = rule9_simplifyStackedQualifiers(result);
  if (r9.applied) {
    result = r9.text;
    count++;
    rulesApplied.push('Rule 9: Simplified stacked hedging and qualifiers');
  }

  // §10: Hyphenated pairs
  const r10 = rule10_normalizeHyphenatedPairs(result);
  if (r10.applied) {
    result = r10.text;
    count++;
    rulesApplied.push('Rule 10: Normalized overused hyphenated compound pairs');
  }

  // §11: Passive voice missing subjects
  const r11 = rule11_resolvePassiveMissingSubjects(result);
  if (r11.applied) {
    result = r11.text;
    count++;
    rulesApplied.push('Rule 11: Restored natural human subject to agentless clauses');
  }

  // §15: Shallow -ing riders
  const r15 = rule15_stripShallowIngRiders(result);
  if (r15.applied) {
    result = r15.text;
    count++;
    rulesApplied.push('Rule 15: Removed shallow trailing -ing participle riders');
  }

  // §17: Borrowed authority
  const r17 = rule17_stripBorrowedAuthority(result);
  if (r17.applied) {
    result = r17.text;
    count++;
    rulesApplied.push('Rule 17: Neutralized vague consensus and borrowed authority');
  }

  // §18: Avoiding is, are, and has
  const r18 = rule18_restoreIsAreHas(result);
  if (r18.applied) {
    result = r18.text;
    count++;
    rulesApplied.push('Rule 18: Restored direct is/are/has copulas over artificial verbs');
  }

  // §6: Forced triads
  const r6 = rule6_smoothForcedTriads(result);
  if (r6.applied) {
    result = r6.text;
    count++;
    rulesApplied.push('Rule 6: Smoothed forced three-part buzzword triads');
  }

  // §12 & §16: Purge AI Vocabulary & Sales language
  const { cleanedText: unClicheText, replacedCount: vocabReplaced } = sanitizeAiVocabulary(result);
  if (vocabReplaced > 0) {
    result = unClicheText;
    count += vocabReplaced;
    rulesApplied.push(`Rule 12/16: Replaced ${vocabReplaced} overused AI tell words`);
  }

  // Clean spacing safely without ever touching decimal numbers or statistics
  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,;:!?])/g, '$1')
    .replace(/([;:])(?=[A-Za-z])/g, '$1 ')
    .replace(/([!?])(?=[A-Za-z])/g, '$1 ')
    .trim();

  return {
    transformedText: restore(result),
    appliedRulesCount: count,
    rulesApplied,
  };
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
 * Applies deterministic linguistic humanization rules across paragraphs and sentences.
 */
export function applyLinguisticHumanizationRules(
  text: string,
  tone: ToneStyle = 'academic'
): { transformedText: string; appliedRulesCount: number; rulesApplied: string[] } {
  return humanizeText25Rules(text, tone);
}

/**
 * Enforces High Burstiness on a list of sentences by actively varying sentence architecture.
 */
export function injectBurstinessRhythm(sentences: string[]): string[] {
  if (sentences.length <= 1) return sentences;

  const result: string[] = [];
  let i = 0;

  while (i < sentences.length) {
    const s1 = sentences[i].trim();
    const s2 = sentences[i + 1]?.trim();
    const words1 = s1.split(/\s+/).filter(Boolean);
    const words2 = s2 ? s2.split(/\s+/).filter(Boolean) : [];

    // If we have two consecutive mid-length sentences of nearly identical length (e.g. 10w-17w),
    // combine with semicolon or conjunction to create rhythm diversity.
    if (
      s2 &&
      words1.length >= 10 &&
      words1.length <= 17 &&
      words2.length >= 10 &&
      words2.length <= 17 &&
      !s1.endsWith('?') &&
      !s2.endsWith('?') &&
      !/^(however|moreover|furthermore|additionally|nevertheless)\b/i.test(s2) &&
      !s1.includes(';') &&
      !s2.includes(';')
    ) {
      const cleanS1 = s1.replace(/[.!]+$/, '');
      const cleanS2 = s2.charAt(0).toLowerCase() + s2.slice(1);
      const combined = `${cleanS1}; specifically, ${cleanS2}`;
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
 * Counts preserved domain terms.
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
 * with awkward pseudo-synonyms.
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
    restored = restored.replace(/\b(?:interlinked\s+with|co-manifested\s+with|intertwined\s+with|meaningfully\s+not\s+statistically\s+independent)\b/gi, 'correlated with');
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
  let aiProb = 12;

  // AI models have low sentence length variance (std dev < 4.5)
  if (burstiness.stdDev < 3.5 || burstiness.uniformRunDetected) {
    aiProb += 45;
  } else if (burstiness.stdDev < 5.2) {
    aiProb += 22;
  } else if (burstiness.stdDev >= 6.8) {
    aiProb -= 10;
  }

  // AI clichés heavily trigger GPTZero / Turnitin
  if (foundCliches.length > 0) {
    aiProb += Math.min(45, foundCliches.length * 15);
  } else {
    aiProb -= 6;
  }

  // Dashes flag AI detector heuristics
  if (/[—–]/.test(fullText)) {
    aiProb += 15;
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
 */
export function estimateAiBypassLikelihood(
  burstiness: BurstinessResult,
  aiClichesFound: number,
  preservedDomainCount: number
): number {
  let likelihood = 88;

  if (burstiness.rating === 'High (Human-like)') {
    likelihood += 10;
  } else if (burstiness.rating === 'Low (AI Uniform)') {
    likelihood -= 25;
  }

  if (aiClichesFound === 0) {
    likelihood += 4;
  } else {
    likelihood -= Math.min(30, aiClichesFound * 6);
  }

  if (preservedDomainCount > 0) {
    likelihood += Math.min(6, preservedDomainCount * 1.5);
  }

  return Math.min(99, Math.max(25, Math.round(likelihood)));
}
