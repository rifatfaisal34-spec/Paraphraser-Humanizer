/**
 * Linguistics Lexicon & Rule-based Dictionary
 * Contains rule tables for:
 * - Tone-adjusted synonyms
 * - Word Class (Nominalization & Verbification)
 * - Affirmative <-> Negative litotes and antonyms
 * - Verb conjugations & past participles (for voice transformation)
 * - Protected technical vocabulary & entity patterns
 */

import { ToneStyle } from '../types';

export interface SynonymEntry {
  lemma: string;
  pos: 'noun' | 'verb' | 'adj' | 'adv';
  professional: string[];
  casual: string[];
  academic: string[];
}

export const SYNONYM_DICTIONARY: Record<string, SynonymEntry> = {
  // Verbs
  analyze: {
    lemma: 'analyze',
    pos: 'verb',
    professional: ['evaluate', 'assess', 'examine', 'review'],
    casual: ['look closely at', 'check out', 'dig into'],
    academic: ['evaluate', 'scrutinize', 'examine', 'assess'],
  },
  analyse: {
    lemma: 'analyse',
    pos: 'verb',
    professional: ['evaluate', 'assess', 'examine', 'review'],
    casual: ['look closely at', 'check out', 'dig into'],
    academic: ['evaluate', 'scrutinize', 'examine', 'assess'],
  },
  show: {
    lemma: 'show',
    pos: 'verb',
    professional: ['demonstrate', 'indicate', 'display', 'illustrate'],
    casual: ['point out', 'reveal', 'highlight'],
    academic: ['demonstrate', 'substantiate', 'exemplify', 'indicate'],
  },
  use: {
    lemma: 'use',
    pos: 'verb',
    professional: ['leverage', 'implement', 'apply', 'employ'],
    casual: ['work with', 'try out', 'adopt'],
    academic: ['utilize', 'employ', 'implement', 'apply'],
  },
  use_noun: {
    lemma: 'use',
    pos: 'noun',
    professional: ['usage', 'application', 'adoption', 'utilization'],
    casual: ['usage', 'habit'],
    academic: ['usage', 'utilization', 'consumption', 'engagement'],
  },
  use_verb: {
    lemma: 'use',
    pos: 'verb',
    professional: ['leverage', 'implement', 'apply', 'employ'],
    casual: ['work with', 'try out', 'adopt'],
    academic: ['utilize', 'employ', 'implement', 'apply'],
  },
  usage: {
    lemma: 'usage',
    pos: 'noun',
    professional: ['utilization', 'adoption', 'application', 'use'],
    casual: ['use', 'habits'],
    academic: ['utilization', 'engagement', 'consumption', 'application'],
  },
  utilize: {
    lemma: 'utilize',
    pos: 'verb',
    professional: ['employ', 'implement', 'leverage', 'apply'],
    casual: ['use', 'try'],
    academic: ['employ', 'implement', 'deploy', 'apply'],
  },
  suggest: {
    lemma: 'suggest',
    pos: 'verb',
    professional: ['indicate', 'propose', 'recommend', 'signal'],
    casual: ['point to', 'hint at', 'say'],
    academic: ['indicate', 'posit', 'signal', 'substantiate'],
  },
  suggested: {
    lemma: 'suggested',
    pos: 'verb',
    professional: ['indicated', 'signaled', 'implied', 'demonstrated'],
    casual: ['pointed to', 'hinted at', 'showed'],
    academic: ['indicated', 'posited', 'signaled', 'evidenced'],
  },
  indicate: {
    lemma: 'indicate',
    pos: 'verb',
    professional: ['demonstrate', 'reflect', 'signal', 'display'],
    casual: ['show', 'point out'],
    academic: ['demonstrate', 'signify', 'substantiate', 'evince'],
  },
  indicated: {
    lemma: 'indicated',
    pos: 'verb',
    professional: ['demonstrated', 'signaled', 'reflected', 'showed'],
    casual: ['showed', 'pointed out'],
    academic: ['demonstrated', 'signified', 'substantiated', 'evinced'],
  },
  influence: {
    lemma: 'influence',
    pos: 'verb',
    professional: ['impact', 'affect', 'shape', 'modulate'],
    casual: ['sway', 'affect', 'touch'],
    academic: ['impact', 'modulate', 'affect', 'shape'],
  },
  influence_noun: {
    lemma: 'influence',
    pos: 'noun',
    professional: ['impact', 'effect', 'bearing', 'implication'],
    casual: ['impact', 'pull'],
    academic: ['impact', 'bearing', 'ramification', 'consequence'],
  },
  collection: {
    lemma: 'collection',
    pos: 'noun',
    professional: ['gathering', 'compilation', 'assembly', 'acquisition'],
    casual: ['gathering', 'roundup'],
    academic: ['acquisition', 'gathering', 'collation', 'procurement'],
  },
  response: {
    lemma: 'response',
    pos: 'noun',
    professional: ['feedback', 'reply', 'input', 'answer'],
    casual: ['answer', 'take', 'reply'],
    academic: ['feedback', 'account', 'narrative', 'submission'],
  },
  responses: {
    lemma: 'responses',
    pos: 'noun',
    professional: ['feedback', 'submissions', 'replies', 'inputs'],
    casual: ['answers', 'replies'],
    academic: ['accounts', 'narratives', 'submissions', 'participant feedback'],
  },
  respondent: {
    lemma: 'respondent',
    pos: 'noun',
    professional: ['participant', 'contributor', 'surveyee'],
    casual: ['person', 'user'],
    academic: ['participant', 'informant', 'subject'],
  },
  respondents: {
    lemma: 'respondents',
    pos: 'noun',
    professional: ['participants', 'contributors', 'survey respondents'],
    casual: ['people', 'users'],
    academic: ['participants', 'informants', 'survey participants', 'study subjects'],
  },
  finding: {
    lemma: 'finding',
    pos: 'noun',
    professional: ['result', 'outcome', 'finding'],
    casual: ['takeaway', 'result'],
    academic: ['result', 'outcome', 'finding'],
  },
  findings: {
    lemma: 'findings',
    pos: 'noun',
    professional: ['results', 'outcomes', 'findings'],
    casual: ['results', 'takeaways'],
    academic: ['results', 'outcomes', 'findings'],
  },
  dataset: {
    lemma: 'dataset',
    pos: 'noun',
    professional: ['data pool', 'collected data', 'repository', 'corpus'],
    casual: ['data', 'numbers'],
    academic: ['corpus', 'sample pool', 'empirical dataset', 'data repository'],
  },
  index: {
    lemma: 'index',
    pos: 'noun',
    professional: ['metric', 'composite score', 'indicator', 'scale'],
    casual: ['score', 'gauge'],
    academic: ['composite metric', 'scale', 'indicator', 'composite measure'],
  },
  measure: {
    lemma: 'measure',
    pos: 'noun',
    professional: ['metric', 'scale', 'instrument', 'assessment'],
    casual: ['gauge', 'yardstick'],
    academic: ['instrument', 'metric', 'assessment tool', 'scale'],
  },
  broader: {
    lemma: 'broader',
    pos: 'adj',
    professional: ['more comprehensive', 'wider', 'expanded', 'aggregate'],
    casual: ['wider', 'bigger'],
    academic: ['more comprehensive', 'wider-ranging', 'aggregate', 'expanded'],
  },
  meaningfully: {
    lemma: 'meaningfully',
    pos: 'adv',
    professional: ['significantly', 'substantially', 'notably', 'markedly'],
    casual: ['really', 'noticeably'],
    academic: ['substantially', 'significantly', 'markedly', 'appreciably'],
  },
  support: {
    lemma: 'support',
    pos: 'verb',
    professional: ['substantiate', 'validate', 'corroborate', 'endorse'],
    casual: ['back up', 'confirm'],
    academic: ['substantiate', 'corroborate', 'validate', 'reinforce'],
  },
  conclusion: {
    lemma: 'conclusion',
    pos: 'noun',
    professional: ['inference', 'deduction', 'determination', 'finding'],
    casual: ['takeaway', 'bottom line'],
    academic: ['inference', 'deduction', 'postulation', 'determination'],
  },
  sample: {
    lemma: 'sample',
    pos: 'noun',
    professional: ['cohort', 'participant group', 'subset'],
    casual: ['group', 'pool'],
    academic: ['study cohort', 'participant cohort', 'investigated sample'],
  },
  students: {
    lemma: 'students',
    pos: 'noun',
    professional: ['learners', 'trainees', 'attendees'],
    casual: ['kids', 'classmates'],
    academic: ['undergraduates', 'learners', 'enrollees'],
  },
  university: {
    lemma: 'university',
    pos: 'noun',
    professional: ['academic institution', 'higher education institution'],
    casual: ['college', 'school'],
    academic: ['higher education institution', 'postsecondary institution', 'academic institution'],
  },
  original: {
    lemma: 'original',
    pos: 'adj',
    professional: ['initial', 'primary', 'baseline', 'preceding'],
    casual: ['first', 'starting'],
    academic: ['baseline', 'primary', 'initial', 'preliminary'],
  },
  frequency: {
    lemma: 'frequency',
    pos: 'noun',
    professional: ['rate of occurrence', 'prevalence', 'recurrence', 'regularity'],
    casual: ['how often', 'rate'],
    academic: ['periodicity', 'recurrence', 'prevalence', 'rate of occurrence'],
  },
  daily: {
    lemma: 'daily',
    pos: 'adj',
    professional: ['routine', 'everyday', 'regular'],
    casual: ['day-to-day', 'everyday'],
    academic: ['quotidian', 'routine', 'day-to-day', 'per-diem'],
  },
  greater: {
    lemma: 'greater',
    pos: 'adj',
    professional: ['higher', 'elevated', 'increased', 'more substantial'],
    casual: ['bigger', 'higher'],
    academic: ['elevated', 'heightened', 'augmented', 'increased'],
  },
  lower: {
    lemma: 'lower',
    pos: 'adj',
    professional: ['reduced', 'diminished', 'attenuated', 'decreased'],
    casual: ['less', 'down'],
    academic: ['attenuated', 'diminished', 'reduced', 'lessened'],
  },
  associated: {
    lemma: 'associated',
    pos: 'adj',
    professional: ['correlated', 'linked', 'connected', 'interrelated'],
    casual: ['tied', 'linked'],
    academic: ['correlated', 'linked', 'interrelated', 'aligned'],
  },
  related: {
    lemma: 'related',
    pos: 'adj',
    professional: ['associated', 'correlated', 'linked', 'connected'],
    casual: ['tied to', 'linked to'],
    academic: ['correlated', 'associated', 'interlinked', 'aligned'],
  },
  nevertheless: {
    lemma: 'nevertheless',
    pos: 'adv',
    professional: ['nonetheless', 'notwithstanding', 'even so', 'regardless'],
    casual: ['still', 'anyway'],
    academic: ['notwithstanding', 'nonetheless', 'conversely', 'yet'],
  },
  contain: {
    lemma: 'contain',
    pos: 'verb',
    professional: ['comprise', 'include', 'encompass', 'incorporate'],
    casual: ['have', 'hold'],
    academic: ['comprise', 'encompass', 'incorporate', 'include'],
  },
  contained: {
    lemma: 'contained',
    pos: 'verb',
    professional: ['comprised', 'included', 'encompassed', 'incorporated'],
    casual: ['had', 'held'],
    academic: ['comprised', 'encompassed', 'incorporated', 'included'],
  },
  identify: {
    lemma: 'identify',
    pos: 'verb',
    professional: ['recognize', 'distinguish', 'classify', 'determine'],
    casual: ['spot', 'pick out'],
    academic: ['distinguish', 'delineate', 'characterize', 'determine'],
  },
  identified: {
    lemma: 'identified',
    pos: 'verb',
    professional: ['recognized', 'distinguished', 'classified', 'determined'],
    casual: ['spotted', 'picked out'],
    academic: ['distinguished', 'characterized', 'delineated', 'classified'],
  },
  help: {
    lemma: 'help',
    pos: 'verb',
    professional: ['assist', 'facilitate', 'support', 'enable'],
    casual: ['lend a hand', 'back up', 'pitch in'],
    academic: ['facilitate', 'support', 'reinforce', 'enable'],
  },
  create: {
    lemma: 'create',
    pos: 'verb',
    professional: ['develop', 'establish', 'generate', 'produce'],
    casual: ['make', 'build', 'craft', 'set up'],
    academic: ['formulate', 'develop', 'generate', 'establish'],
  },
  improve: {
    lemma: 'improve',
    pos: 'verb',
    professional: ['enhance', 'optimize', 'elevate', 'upgrade'],
    casual: ['boost', 'sharpen', 'make better', 'polish'],
    academic: ['enhance', 'optimize', 'refine', 'augment'],
  },
  explain: {
    lemma: 'explain',
    pos: 'verb',
    professional: ['clarify', 'outline', 'detail', 'articulate'],
    casual: ['walk through', 'break down', 'spell out'],
    academic: ['elucidate', 'delineate', 'clarify', 'detail'],
  },
  change: {
    lemma: 'change',
    pos: 'verb',
    professional: ['modify', 'adjust', 'adapt', 'restructure'],
    casual: ['switch up', 'tweak', 'shift', 'swap'],
    academic: ['modify', 'alter', 'adjust', 'reconfigure'],
  },
  start: {
    lemma: 'start',
    pos: 'verb',
    professional: ['initiate', 'commence', 'launch', 'institute'],
    casual: ['kick off', 'get rolling', 'get going'],
    academic: ['initiate', 'commence', 'undertake', 'launch'],
  },
  finish: {
    lemma: 'finish',
    pos: 'verb',
    professional: ['conclude', 'finalize', 'complete', 'deliver'],
    casual: ['wrap up', 'wrap', 'round off'],
    academic: ['conclude', 'finalize', 'complete'],
  },
  find: {
    lemma: 'find',
    pos: 'verb',
    professional: ['identify', 'discover', 'determine', 'locate'],
    casual: ['track down', 'uncover', 'turn up'],
    academic: ['ascertain', 'identify', 'determine', 'discern'],
  },
  build: {
    lemma: 'build',
    pos: 'verb',
    professional: ['construct', 'architect', 'establish', 'assemble'],
    casual: ['put together', 'make', 'assemble'],
    academic: ['construct', 'develop', 'engineer', 'synthesize'],
  },
  give: {
    lemma: 'give',
    pos: 'verb',
    professional: ['provide', 'deliver', 'distribute', 'furnish'],
    casual: ['hand over', 'pass along', 'share'],
    academic: ['provide', 'furnish', 'deliver', 'present'],
  },
  need: {
    lemma: 'need',
    pos: 'verb',
    professional: ['require', 'necessitate', 'mandate', 'demand'],
    casual: ['call for', 'want', 'count on'],
    academic: ['require', 'necessitate', 'demand'],
  },
  think: {
    lemma: 'think',
    pos: 'verb',
    professional: ['consider', 'anticipate', 'project', 'estimate'],
    casual: ['reckon', 'figure', 'feel', 'guess'],
    academic: ['posit', 'hypothesize', 'postulate', 'consider'],
  },
  decide: {
    lemma: 'decide',
    pos: 'verb',
    professional: ['determine', 'resolve', 'conclude', 'elect'],
    casual: ['settle on', 'pick', 'choose'],
    academic: ['determine', 'resolve', 'conclude'],
  },
  stop: {
    lemma: 'stop',
    pos: 'verb',
    professional: ['halt', 'discontinue', 'suspend', 'terminate'],
    casual: ['pause', 'call off', 'hold off'],
    academic: ['discontinue', 'halt', 'suspend', 'cease'],
  },

  // Adjectives
  important: {
    lemma: 'important',
    pos: 'adj',
    professional: ['crucial', 'pivotal', 'significant', 'essential'],
    casual: ['key', 'major', 'big', 'vital'],
    academic: ['salient', 'pivotal', 'significant', 'essential'],
  },
  good: {
    lemma: 'good',
    pos: 'adj',
    professional: ['effective', 'beneficial', 'valuable', 'productive'],
    casual: ['great', 'solid', 'neat', 'handy'],
    academic: ['effective', 'optimal', 'beneficial', 'favorable'],
  },
  bad: {
    lemma: 'bad',
    pos: 'adj',
    professional: ['suboptimal', 'unfavorable', 'adverse', 'deficient'],
    casual: ['poor', 'rough', 'tough', 'troublesome'],
    academic: ['detrimental', 'adverse', 'suboptimal', 'unfavorable'],
  },
  big: {
    lemma: 'big',
    pos: 'adj',
    professional: ['substantial', 'considerable', 'extensive', 'sizable'],
    casual: ['huge', 'giant', 'notable'],
    academic: ['substantial', 'considerable', 'extensive'],
  },
  small: {
    lemma: 'small',
    pos: 'adj',
    professional: ['compact', 'limited', 'moderate', 'focused'],
    casual: ['tiny', 'minor', 'slight'],
    academic: ['limited', 'marginal', 'moderate', 'negligible'],
  },
  clear: {
    lemma: 'clear',
    pos: 'adj',
    professional: ['transparent', 'evident', 'apparent', 'distinct'],
    casual: ['plain', 'obvious', 'simple'],
    academic: ['unambiguous', 'evident', 'apparent', 'distinct'],
  },
  difficult: {
    lemma: 'difficult',
    pos: 'adj',
    professional: ['challenging', 'demanding', 'complex', 'rigorous'],
    casual: ['tough', 'tricky', 'hard'],
    academic: ['demanding', 'complex', 'rigorous', 'challenging'],
  },
  easy: {
    lemma: 'easy',
    pos: 'adj',
    professional: ['straightforward', 'accessible', 'streamlined', 'manageable'],
    casual: ['simple', 'breeze', 'smooth'],
    academic: ['straightforward', 'accessible', 'elementary'],
  },
  fast: {
    lemma: 'fast',
    pos: 'adj',
    professional: ['expeditious', 'rapid', 'prompt', 'accelerated'],
    casual: ['quick', 'snappy', 'speedy'],
    academic: ['rapid', 'prompt', 'expeditious', 'swift'],
  },
  new: {
    lemma: 'new',
    pos: 'adj',
    professional: ['innovative', 'novel', 'contemporary', 'updated'],
    casual: ['fresh', 'modern', 'brand-new'],
    academic: ['novel', 'contemporary', 'innovative'],
  },
  useful: {
    lemma: 'useful',
    pos: 'adj',
    professional: ['effective', 'practical', 'functional', 'instrumental'],
    casual: ['handy', 'helpful', 'worthwhile'],
    academic: ['effective', 'practical', 'advantageous'],
  },
  accurate: {
    lemma: 'accurate',
    pos: 'adj',
    professional: ['precise', 'reliable', 'validated', 'correct'],
    casual: ['spot on', 'exact', 'right'],
    academic: ['precise', 'exact', 'rigorous', 'reliable'],
  },

  // Adverbs
  quickly: {
    lemma: 'quickly',
    pos: 'adv',
    professional: ['expeditiously', 'promptly', 'swiftly'],
    casual: ['fast', 'in no time', 'right away'],
    academic: ['promptly', 'swiftly', 'rapidly'],
  },
  very: {
    lemma: 'very',
    pos: 'adv',
    professional: ['substantially', 'significantly', 'notably', 'markedly'],
    casual: ['super', 'really', 'pretty'],
    academic: ['markedly', 'significantly', 'substantially'],
  },
  often: {
    lemma: 'often',
    pos: 'adv',
    professional: ['frequently', 'regularly', 'consistently', 'routinely'],
    casual: ['a lot', 'time and again', 'mostly'],
    academic: ['frequently', 'customarily', 'routinely'],
  },
  clearly: {
    lemma: 'clearly',
    pos: 'adv',
    professional: ['evidently', 'demonstrably', 'distinctly'],
    casual: ['obviously', 'plainly', 'for sure'],
    academic: ['distinctly', 'demonstrably', 'evidently'],
  },
};

/**
 * Word Class (Nominalization & Verbification) Table
 * Verb -> Noun Phrase (academic & formal nominalization)
 * e.g., "analyses" -> "conducts an analysis of"
 */
export interface WordClassEntry {
  verb: string;
  verbPast: string;
  verbThirdPerson: string;
  verbGerund: string;
  noun: string;
  prep: string;
  nominalPhrase: {
    base: string;
    past: string;
    thirdPerson: string;
    gerund: string;
  };
}

export const WORD_CLASS_MAPPINGS: Record<string, WordClassEntry> = {
  analyze: {
    verb: 'analyze',
    verbPast: 'analyzed',
    verbThirdPerson: 'analyzes',
    verbGerund: 'analyzing',
    noun: 'analysis',
    prep: 'of',
    nominalPhrase: {
      base: 'conduct an analysis of',
      past: 'conducted an analysis of',
      thirdPerson: 'conducts an analysis of',
      gerund: 'conducting an analysis of',
    },
  },
  analyse: {
    verb: 'analyse',
    verbPast: 'analysed',
    verbThirdPerson: 'analyses',
    verbGerund: 'analysing',
    noun: 'analysis',
    prep: 'of',
    nominalPhrase: {
      base: 'conduct an analysis of',
      past: 'conducted an analysis of',
      thirdPerson: 'conducts an analysis of',
      gerund: 'conducting an analysis of',
    },
  },
  investigate: {
    verb: 'investigate',
    verbPast: 'investigated',
    verbThirdPerson: 'investigates',
    verbGerund: 'investigating',
    noun: 'investigation',
    prep: 'into',
    nominalPhrase: {
      base: 'carry out an investigation into',
      past: 'carried out an investigation into',
      thirdPerson: 'carries out an investigation into',
      gerund: 'carrying out an investigation into',
    },
  },
  evaluate: {
    verb: 'evaluate',
    verbPast: 'evaluated',
    verbThirdPerson: 'evaluates',
    verbGerund: 'evaluating',
    noun: 'evaluation',
    prep: 'of',
    nominalPhrase: {
      base: 'perform an evaluation of',
      past: 'performed an evaluation of',
      thirdPerson: 'performs an evaluation of',
      gerund: 'performing an evaluation of',
    },
  },
  conclude: {
    verb: 'conclude',
    verbPast: 'concluded',
    verbThirdPerson: 'concludes',
    verbGerund: 'concluding',
    noun: 'conclusion',
    prep: 'that',
    nominalPhrase: {
      base: 'reach the conclusion that',
      past: 'reached the conclusion that',
      thirdPerson: 'reaches the conclusion that',
      gerund: 'reaching the conclusion that',
    },
  },
  decide: {
    verb: 'decide',
    verbPast: 'decided',
    verbThirdPerson: 'decides',
    verbGerund: 'deciding',
    noun: 'decision',
    prep: 'to',
    nominalPhrase: {
      base: 'make a decision to',
      past: 'made a decision to',
      thirdPerson: 'makes a decision to',
      gerund: 'making a decision to',
    },
  },
  explain: {
    verb: 'explain',
    verbPast: 'explained',
    verbThirdPerson: 'explains',
    verbGerund: 'explaining',
    noun: 'explanation',
    prep: 'of',
    nominalPhrase: {
      base: 'provide an explanation of',
      past: 'provided an explanation of',
      thirdPerson: 'provides an explanation of',
      gerund: 'providing an explanation of',
    },
  },
  demonstrate: {
    verb: 'demonstrate',
    verbPast: 'demonstrated',
    verbThirdPerson: 'demonstrates',
    verbGerund: 'demonstrating',
    noun: 'demonstration',
    prep: 'of',
    nominalPhrase: {
      base: 'provide a demonstration of',
      past: 'provided a demonstration of',
      thirdPerson: 'provides a demonstration of',
      gerund: 'providing a demonstration of',
    },
  },
  recommend: {
    verb: 'recommend',
    verbPast: 'recommended',
    verbThirdPerson: 'recommends',
    verbGerund: 'recommending',
    noun: 'recommendation',
    prep: 'for',
    nominalPhrase: {
      base: 'make a recommendation for',
      past: 'made a recommendation for',
      thirdPerson: 'makes a recommendation for',
      gerund: 'making a recommendation for',
    },
  },
  implement: {
    verb: 'implement',
    verbPast: 'implemented',
    verbThirdPerson: 'implements',
    verbGerund: 'implementing',
    noun: 'implementation',
    prep: 'of',
    nominalPhrase: {
      base: 'undertake the implementation of',
      past: 'undertook the implementation of',
      thirdPerson: 'undertakes the implementation of',
      gerund: 'undertaking the implementation of',
    },
  },
  examine: {
    verb: 'examine',
    verbPast: 'examined',
    verbThirdPerson: 'examines',
    verbGerund: 'examining',
    noun: 'examination',
    prep: 'of',
    nominalPhrase: {
      base: 'conduct an examination of',
      past: 'conducted an examination of',
      thirdPerson: 'conducts an examination of',
      gerund: 'conducting an examination of',
    },
  },
  describe: {
    verb: 'describe',
    verbPast: 'described',
    verbThirdPerson: 'describes',
    verbGerund: 'describing',
    noun: 'description',
    prep: 'of',
    nominalPhrase: {
      base: 'furnish a description of',
      past: 'furnished a description of',
      thirdPerson: 'furnishes a description of',
      gerund: 'furnishing a description of',
    },
  },
  measure: {
    verb: 'measure',
    verbPast: 'measured',
    verbThirdPerson: 'measures',
    verbGerund: 'measuring',
    noun: 'measurement',
    prep: 'of',
    nominalPhrase: {
      base: 'take measurements of',
      past: 'took measurements of',
      thirdPerson: 'takes measurements of',
      gerund: 'taking measurements of',
    },
  },
  reduce: {
    verb: 'reduce',
    verbPast: 'reduced',
    verbThirdPerson: 'reduces',
    verbGerund: 'reducing',
    noun: 'reduction',
    prep: 'in',
    nominalPhrase: {
      base: 'achieve a reduction in',
      past: 'achieved a reduction in',
      thirdPerson: 'achieves a reduction in',
      gerund: 'achieving a reduction in',
    },
  },
};

/**
 * Litotes & Affirmative <-> Negative Inversion
 * "is effective" <-> "is not ineffective" / "does not fail to be effective"
 */
export interface PolarityPair {
  affirmative: string;
  negative: string;
  context: 'predicate' | 'adverb' | 'verb';
}

export const POLARITY_PAIRS: PolarityPair[] = [
  { affirmative: 'effective', negative: 'not ineffective', context: 'predicate' },
  { affirmative: 'simple', negative: 'not complicated', context: 'predicate' },
  { affirmative: 'easy', negative: 'not difficult', context: 'predicate' },
  { affirmative: 'difficult', negative: 'not easy', context: 'predicate' },
  { affirmative: 'common', negative: 'not uncommon', context: 'predicate' },
  { affirmative: 'frequent', negative: 'not infrequent', context: 'predicate' },
  { affirmative: 'significant', negative: 'not insignificant', context: 'predicate' },
  { affirmative: 'important', negative: 'not unimportant', context: 'predicate' },
  { affirmative: 'likely', negative: 'not unlikely', context: 'predicate' },
  { affirmative: 'possible', negative: 'not impossible', context: 'predicate' },
  { affirmative: 'clear', negative: 'not ambiguous', context: 'predicate' },
  { affirmative: 'reliable', negative: 'not unreliable', context: 'predicate' },
  { affirmative: 'consistent', negative: 'not inconsistent', context: 'predicate' },
  { affirmative: 'useful', negative: 'not useless', context: 'predicate' },
  { affirmative: 'accurate', negative: 'not inaccurate', context: 'predicate' },
];

/**
 * Verb conjugation table for voice conversion
 */
export interface VerbVoiceForms {
  base: string;
  past: string;
  pastParticiple: string;
  thirdPerson: string;
  gerund: string;
}

export const VERB_FORMS: Record<string, VerbVoiceForms> = {
  analyze: { base: 'analyze', past: 'analyzed', pastParticiple: 'analyzed', thirdPerson: 'analyzes', gerund: 'analyzing' },
  analyse: { base: 'analyse', past: 'analysed', pastParticiple: 'analysed', thirdPerson: 'analyses', gerund: 'analysing' },
  examine: { base: 'examine', past: 'examined', pastParticiple: 'examined', thirdPerson: 'examines', gerund: 'examining' },
  write: { base: 'write', past: 'wrote', pastParticiple: 'written', thirdPerson: 'writes', gerund: 'writing' },
  conduct: { base: 'conduct', past: 'conducted', pastParticiple: 'conducted', thirdPerson: 'conducts', gerund: 'conducting' },
  establish: { base: 'establish', past: 'established', pastParticiple: 'established', thirdPerson: 'establishes', gerund: 'establishing' },
  create: { base: 'create', past: 'created', pastParticiple: 'created', thirdPerson: 'creates', gerund: 'creating' },
  design: { base: 'design', past: 'designed', pastParticiple: 'designed', thirdPerson: 'designs', gerund: 'designing' },
  perform: { base: 'perform', past: 'performed', pastParticiple: 'performed', thirdPerson: 'performs', gerund: 'performing' },
  produce: { base: 'produce', past: 'produced', pastParticiple: 'produced', thirdPerson: 'produces', gerund: 'producing' },
  implement: { base: 'implement', past: 'implemented', pastParticiple: 'implemented', thirdPerson: 'implements', gerund: 'implementing' },
  observe: { base: 'observe', past: 'observed', pastParticiple: 'observed', thirdPerson: 'observes', gerund: 'observing' },
  discover: { base: 'discover', past: 'discovered', pastParticiple: 'discovered', thirdPerson: 'discovers', gerund: 'discovering' },
  present: { base: 'present', past: 'presented', pastParticiple: 'presented', thirdPerson: 'presents', gerund: 'presenting' },
  find: { base: 'find', past: 'found', pastParticiple: 'found', thirdPerson: 'finds', gerund: 'finding' },
  develop: { base: 'develop', past: 'developed', pastParticiple: 'developed', thirdPerson: 'develops', gerund: 'developing' },
  test: { base: 'test', past: 'tested', pastParticiple: 'tested', thirdPerson: 'tests', gerund: 'testing' },
  publish: { base: 'publish', past: 'published', pastParticiple: 'published', thirdPerson: 'publishes', gerund: 'publishing' },
  evaluate: { base: 'evaluate', past: 'evaluated', pastParticiple: 'evaluated', thirdPerson: 'evaluates', gerund: 'evaluating' },
  prepare: { base: 'prepare', past: 'prepared', pastParticiple: 'prepared', thirdPerson: 'prepares', gerund: 'preparing' },
  execute: { base: 'execute', past: 'executed', pastParticiple: 'executed', thirdPerson: 'executes', gerund: 'executing' },
  identify: { base: 'identify', past: 'identified', pastParticiple: 'identified', thirdPerson: 'identifies', gerund: 'identifying' },
  reveal: { base: 'reveal', past: 'revealed', pastParticiple: 'revealed', thirdPerson: 'reveals', gerund: 'revealing' },
  propose: { base: 'propose', past: 'proposed', pastParticiple: 'proposed', thirdPerson: 'proposes', gerund: 'proposing' },
  achieve: { base: 'achieve', past: 'achieved', pastParticiple: 'achieved', thirdPerson: 'achieves', gerund: 'achieving' },
  complete: { base: 'complete', past: 'completed', pastParticiple: 'completed', thirdPerson: 'completes', gerund: 'completing' },
  build: { base: 'build', past: 'built', pastParticiple: 'built', thirdPerson: 'builds', gerund: 'building' },
  deliver: { base: 'deliver', past: 'delivered', pastParticiple: 'delivered', thirdPerson: 'delivers', gerund: 'delivering' },
  review: { base: 'review', past: 'reviewed', pastParticiple: 'reviewed', thirdPerson: 'reviews', gerund: 'reviewing' },
  discuss: { base: 'discuss', past: 'discussed', pastParticiple: 'discussed', thirdPerson: 'discusses', gerund: 'discussing' },
  calculate: { base: 'calculate', past: 'calculated', pastParticiple: 'calculated', thirdPerson: 'calculates', gerund: 'calculating' },
  collect: { base: 'collect', past: 'collected', pastParticiple: 'collected', thirdPerson: 'collects', gerund: 'collecting' },
  organize: { base: 'organize', past: 'organized', pastParticiple: 'organized', thirdPerson: 'organizes', gerund: 'organizing' },
  investigate: { base: 'investigate', past: 'investigated', pastParticiple: 'investigated', thirdPerson: 'investigates', gerund: 'investigating' },
  measure: { base: 'measure', past: 'measured', pastParticiple: 'measured', thirdPerson: 'measures', gerund: 'measuring' },
  solve: { base: 'solve', past: 'solved', pastParticiple: 'solved', thirdPerson: 'solves', gerund: 'solving' },
};

/**
 * Protected Technical Terms, Proper Noun acronyms, and Scientific Vocabulary
 * Guaranteed to NEVER be altered or corrupted by generic synonym substitution.
 */
export const PROTECTED_TERMS_SET = new Set([
  'docx', 'pdf', 'html', 'css', 'javascript', 'typescript', 'python', 'java',
  'api', 'rest', 'graphql', 'sql', 'nosql', 'json', 'xml', 'http', 'https',
  'dna', 'rna', 'crispr', 'pcr', 'mitochondria', 'atp', 'covid-19', 'sars-cov-2',
  'quantum', 'gpu', 'cpu', 'ram', 'ssd', 'usb', 'bluetooth', 'wifi',
  'react', 'vue', 'angular', 'node', 'express', 'docker', 'kubernetes',
  'aws', 'gcp', 'azure', 'linux', 'unix', 'macos', 'windows', 'ios', 'android',
  'google', 'microsoft', 'apple', 'amazon', 'meta', 'github',
  'flesch-kincaid', 'pearson', 'euclidean', 'gaussian', 'bayesian', 'markov',
  'ai', 'nlp', 'llm', 'ml', 'ann', 'cnn', 'rnn', 'lstm', 'svm',
  'usa', 'uk', 'eu', 'un', 'who', 'nato', 'nasa', 'fda', 'mit', 'stanford',
  'celsius', 'fahrenheit', 'kelvin', 'joule', 'watt', 'pascal', 'newton',
  // Domain & Methodological Terms (Preserved to avoid unnatural over-synonymization AI flag)
  'sample', 'samples', 'dataset', 'datasets', 'correlated', 'correlation', 'correlations',
  'participants', 'methodology', 'p-value', 'regression',
]);

/**
 * Subordinating Conjunction patterns for clause inversion
 * e.g., "Because X, Y" <-> "Y, because X"
 */
export const SUBORDINATING_CONJUNCTIONS = [
  'because',
  'although',
  'even though',
  'though',
  'while',
  'whereas',
  'since',
  'given that',
  'in order that',
  'in order to',
  'as long as',
  'provided that',
  'unless',
  'until',
  'after',
  'before',
  'when',
  'whenever',
  'where',
  'wherever',
];

/**
 * Academic Discourse Connectors
 */
export const ACADEMIC_CONNECTORS = [
  'furthermore',
  'moreover',
  'consequently',
  'in addition',
  'subsequently',
  'notably',
  'fundamentally',
  'conversely',
  'nevertheless',
  'notwithstanding',
];

/**
 * Professional Discourse Connectors
 */
export const PROFESSIONAL_CONNECTORS = [
  'additionally',
  'accordingly',
  'as a result',
  'in particular',
  'specifically',
  'importantly',
  'to that end',
  'meanwhile',
  'similarly',
];

/**
 * Casual Discourse Connectors
 */
export const CASUAL_CONNECTORS = [
  'also',
  'plus',
  'so',
  'on top of that',
  'that said',
  'anyway',
  'by the way',
  'meanwhile',
];
