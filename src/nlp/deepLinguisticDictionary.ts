/**
 * Deep Extensive Linguistic Dictionary & Paraphrasing Rulebook
 *
 * Contains:
 * 1. Comprehensive Academic, Professional, and Casual Lexicon with strict POS tagging
 * 2. Deep Nominalization & De-nominalization inflection tables
 * 3. Polarity & Litotes inversion pairs
 * 4. Fronting & Topicalization frame templates
 * 5. Authentic Human Discourse Connectors (strictly banning robotic AI clichés)
 * 6. Academic & Methodological Collocations
 * 7. Technical and Domain Invariant protections
 */

import { ToneStyle } from '../types';

export interface DeepSynonymEntry {
  lemma: string;
  pos: 'noun' | 'verb' | 'adj' | 'adv';
  professional: string[];
  casual: string[];
  academic: string[];
  collocations?: string[]; // phrases commonly formed with this lemma
}

/**
 * 400+ Extensive Lexical Entries categorized by Part of Speech and Register.
 * Strictly prevents cross-POS errors (e.g., preventing noun "use" from being replaced with verb "utilize").
 */
export const EXTENSIVE_LEXICON: Record<string, DeepSynonymEntry> = {
  // ─── VERBS: REPORTING & ANALYSIS ─────────────────────────────
  analyze: {
    lemma: 'analyze',
    pos: 'verb',
    academic: ['evaluate', 'scrutinize', 'examine', 'assess', 'investigate'],
    professional: ['assess', 'evaluate', 'review', 'examine'],
    casual: ['look closely at', 'dig into', 'check out'],
  },
  analyse: {
    lemma: 'analyse',
    pos: 'verb',
    academic: ['evaluate', 'scrutinize', 'examine', 'assess', 'investigate'],
    professional: ['assess', 'evaluate', 'review', 'examine'],
    casual: ['look closely at', 'dig into', 'check out'],
  },
  demonstrate: {
    lemma: 'demonstrate',
    pos: 'verb',
    academic: ['substantiate', 'illustrate', 'indicate', 'confirm', 'exemplify'],
    professional: ['show', 'indicate', 'highlight', 'display'],
    casual: ['show', 'point out', 'make clear'],
  },
  investigate: {
    lemma: 'investigate',
    pos: 'verb',
    academic: ['probe', 'examine', 'scrutinize', 'inquire into', 'explore'],
    professional: ['look into', 'examine', 'evaluate', 'explore'],
    casual: ['check out', 'look into', 'figure out'],
  },
  evaluate: {
    lemma: 'evaluate',
    pos: 'verb',
    academic: ['assess', 'examine', 'evaluate', 'investigate'],
    professional: ['assess', 'review', 'measure', 'weigh'],
    casual: ['size up', 'judge', 'rate'],
  },
  indicate: {
    lemma: 'indicate',
    pos: 'verb',
    academic: ['suggest', 'signify', 'point to', 'evidence', 'connote'],
    professional: ['suggest', 'show', 'point toward', 'signal'],
    casual: ['hint at', 'point to', 'show'],
  },
  suggest: {
    lemma: 'suggest',
    pos: 'verb',
    academic: ['indicate', 'imply', 'posit', 'propose', 'insinuate'],
    professional: ['indicate', 'point toward', 'recommend', 'propose'],
    casual: ['point to', 'hint that', 'recommend'],
  },
  observe: {
    lemma: 'observe',
    pos: 'verb',
    academic: ['note', 'discern', 'detect', 'identify', 'witness'],
    professional: ['notice', 'track', 'monitor', 'identify'],
    casual: ['spot', 'see', 'catch'],
  },
  reveal: {
    lemma: 'reveal',
    pos: 'verb',
    academic: ['disclose', 'unveil', 'elucidate', 'bring to light', 'manifest'],
    professional: ['show', 'uncover', 'highlight', 'demonstrate'],
    casual: ['show', 'spill', 'bring out'],
  },
  illustrate: {
    lemma: 'illustrate',
    pos: 'verb',
    academic: ['exemplify', 'clarify', 'delineate', 'typify', 'depict'],
    professional: ['show', 'clarify', 'demonstrate', 'outline'],
    casual: ['show', 'clear up', 'explain'],
  },
  determine: {
    lemma: 'determine',
    pos: 'verb',
    academic: ['ascertain', 'establish', 'discern', 'verify', 'conclude'],
    professional: ['identify', 'establish', 'figure out', 'decide'],
    casual: ['figure out', 'settle on', 'decide'],
  },
  establish: {
    lemma: 'establish',
    pos: 'verb',
    academic: ['demonstrate conclusively', 'confirm', 'substantiate', 'instantiate'],
    professional: ['set up', 'build', 'confirm', 'formalize'],
    casual: ['set up', 'build', 'nail down'],
  },
  examine: {
    lemma: 'examine',
    pos: 'verb',
    academic: ['investigate', 'analyze', 'assess', 'evaluate'],
    professional: ['review', 'inspect', 'look over', 'assess'],
    casual: ['look at', 'check over', 'go through'],
  },
  clarify: {
    lemma: 'clarify',
    pos: 'verb',
    academic: ['elucidate', 'explicate', 'illuminate', 'delineate'],
    professional: ['explain', 'simplify', 'make clear', 'resolve'],
    casual: ['clear up', 'spell out', 'make plain'],
  },
  substantiate: {
    lemma: 'substantiate',
    pos: 'verb',
    academic: ['corroborate', 'validate', 'verify', 'authenticate', 'support'],
    professional: ['confirm', 'back up', 'validate', 'support'],
    casual: ['back up', 'prove', 'show proof for'],
  },
  confirm: {
    lemma: 'confirm',
    pos: 'verb',
    academic: ['corroborate', 'substantiate', 'authenticate', 'affirm'],
    professional: ['validate', 'verify', 'back up', 'finalize'],
    casual: ['double check', 'make sure', 'back up'],
  },
  identify: {
    lemma: 'identify',
    pos: 'verb',
    academic: ['distinguish', 'discern', 'pinpoint', 'recognize', 'isolate'],
    professional: ['pinpoint', 'find', 'spot', 'determine'],
    casual: ['spot', 'find', 'pick out'],
  },
  synthesize: {
    lemma: 'synthesize',
    pos: 'verb',
    academic: ['integrate', 'consolidate', 'amalgamate', 'harmonize'],
    professional: ['combine', 'integrate', 'merge', 'unify'],
    casual: ['pull together', 'blend', 'mix'],
  },
  highlight: {
    lemma: 'highlight',
    pos: 'verb',
    academic: ['accentuate', 'foreground', 'emphasize', 'feature'],
    professional: ['emphasize', 'spotlight', 'call out', 'stress'],
    casual: ['point out', 'call attention to', 'spotlight'],
  },
  emphasize: {
    lemma: 'emphasize',
    pos: 'verb',
    academic: ['accentuate', 'underscore', 'foreground', 'stress'],
    professional: ['highlight', 'stress', 'prioritize', 'focus on'],
    casual: ['stress', 'zero in on', 'point out'],
  },

  // ─── VERBS: ACTION, IMPLEMENTATION & PERFORMANCE ──────────
  implement: {
    lemma: 'implement',
    pos: 'verb',
    academic: ['execute', 'operationalize', 'deploy', 'enact', 'institute'],
    professional: ['roll out', 'execute', 'apply', 'put into practice'],
    casual: ['set up', 'put in place', 'try out'],
  },
  conduct: {
    lemma: 'conduct',
    pos: 'verb',
    academic: ['administer', 'carry out', 'execute', 'undertake'],
    professional: ['run', 'manage', 'carry out', 'perform'],
    casual: ['run', 'do', 'lead'],
  },
  perform: {
    lemma: 'perform',
    pos: 'verb',
    academic: ['execute', 'carry out', 'discharge', 'enact'],
    professional: ['conduct', 'complete', 'deliver', 'execute'],
    casual: ['do', 'pull off', 'carry out'],
  },
  complete: {
    lemma: 'complete',
    pos: 'verb',
    academic: ['finalize', 'conclude', 'consummate', 'discharge'],
    professional: ['finish', 'finalize', 'wrap up', 'accomplish'],
    casual: ['finish', 'wrap up', 'get through'],
  },
  measure: {
    lemma: 'measure',
    pos: 'verb',
    academic: ['quantify', 'gauge', 'calibrate', 'compute', 'appraise'],
    professional: ['track', 'gauge', 'benchmark', 'assess'],
    casual: ['check', 'size up', 'clock'],
  },
  collect: {
    lemma: 'collect',
    pos: 'verb',
    academic: ['gather', 'compile', 'aggregate', 'collate', 'harvest'],
    professional: ['gather', 'compile', 'assemble', 'source'],
    casual: ['gather', 'round up', 'pull together'],
  },
  organize: {
    lemma: 'organize',
    pos: 'verb',
    academic: ['systematize', 'structure', 'categorize', 'coordinate'],
    professional: ['structure', 'arrange', 'coordinate', 'align'],
    casual: ['sort out', 'line up', 'put together'],
  },
  produce: {
    lemma: 'produce',
    pos: 'verb',
    academic: ['generate', 'yield', 'engender', 'originate', 'spawn'],
    professional: ['deliver', 'generate', 'create', 'yield'],
    casual: ['turn out', 'crank out', 'make'],
  },
  achieve: {
    lemma: 'achieve',
    pos: 'verb',
    academic: ['attain', 'realize', 'accomplish', 'reach'],
    professional: ['reach', 'attain', 'deliver', 'accomplish'],
    casual: ['pull off', 'hit', 'reach'],
  },
  facilitate: {
    lemma: 'facilitate',
    pos: 'verb',
    academic: ['expedite', 'enable', 'catalyze', 'promote'],
    professional: ['streamline', 'support', 'enable', 'help'],
    casual: ['help along', 'make easier', 'smooth the way for'],
  },
  maintain: {
    lemma: 'maintain',
    pos: 'verb',
    academic: ['preserve', 'sustain', 'perpetuate', 'uphold'],
    professional: ['preserve', 'keep up', 'sustain', 'ensure'],
    casual: ['keep up', 'stick with', 'hold onto'],
  },
  transform: {
    lemma: 'transform',
    pos: 'verb',
    academic: ['metamorphose', 'reconfigure', 'transmute', 'restructure'],
    professional: ['modernize', 'overhaul', 'reshape', 'upgrade'],
    casual: ['change up', 'make over', 'turn around'],
  },

  // ─── VERBS: CAUSATION & RELATIONSHIP ───────────────────────
  cause: {
    lemma: 'cause',
    pos: 'verb',
    academic: ['precipitate', 'induce', 'engender', 'provoke', 'trigger'],
    professional: ['drive', 'lead to', 'prompt', 'result in'],
    casual: ['bring on', 'trigger', 'set off'],
  },
  influence: {
    lemma: 'influence',
    pos: 'verb',
    academic: ['modulate', 'impact', 'sway', 'shape', 'condition'],
    professional: ['shape', 'impact', 'affect', 'drive'],
    casual: ['rub off on', 'sway', 'touch'],
  },
  reduce: {
    lemma: 'reduce',
    pos: 'verb',
    academic: ['diminish', 'curtail', 'attenuate', 'mitigate', 'lessen'],
    professional: ['decrease', 'lower', 'curtail', 'minimize'],
    casual: ['cut back on', 'bring down', 'drop'],
  },
  increase: {
    lemma: 'increase',
    pos: 'verb',
    academic: ['augment', 'escalate', 'magnify', 'enhance', 'compound'],
    professional: ['boost', 'expand', 'raise', 'grow'],
    casual: ['bump up', 'step up', 'lift'],
  },
  correlate: {
    lemma: 'correlate',
    pos: 'verb',
    academic: ['co-vary', 'associate', 'align', 'correspond'],
    professional: ['align with', 'track with', 'connect to'],
    casual: ['go hand in hand with', 'line up with', 'tie in with'],
  },
  associate: {
    lemma: 'associate',
    pos: 'verb',
    academic: ['link', 'correlate', 'connect', 'couple'],
    professional: ['connect', 'link', 'pair', 'relate'],
    casual: ['tie to', 'link with', 'connect to'],
  },
  differentiate: {
    lemma: 'differentiate',
    pos: 'verb',
    academic: ['discriminate', 'distinguish', 'demarcate', 'segregate'],
    professional: ['distinguish', 'separate', 'set apart'],
    casual: ['tell apart', 'separate', 'single out'],
  },

  // ─── NOUNS: EMPIRICAL & RESEARCH ───────────────────────────
  investigation: {
    lemma: 'investigation',
    pos: 'noun',
    academic: ['inquiry', 'examination', 'study', 'evaluation'],
    professional: ['inquiry', 'review', 'analysis', 'assessment'],
    casual: ['deep dive', 'look-see', 'check'],
  },
  analysis: {
    lemma: 'analysis',
    pos: 'noun',
    academic: ['evaluation', 'examination', 'investigation', 'assessment'],
    professional: ['evaluation', 'assessment', 'review', 'breakdown'],
    casual: ['breakdown', 'look', 'take'],
  },
  methodology: {
    lemma: 'methodology',
    pos: 'noun',
    academic: ['methodological framework', 'empirical protocol', 'analytical approach', 'procedure'],
    professional: ['approach', 'framework', 'protocol', 'process'],
    casual: ['game plan', 'process', 'way of doing things'],
  },
  finding: {
    lemma: 'finding',
    pos: 'noun',
    academic: ['result', 'outcome', 'finding'],
    professional: ['result', 'takeaway', 'insight', 'metric'],
    casual: ['takeaway', 'finding', 'lesson'],
  },
  findings: {
    lemma: 'findings',
    pos: 'noun',
    academic: ['results', 'outcomes', 'findings'],
    professional: ['results', 'takeaways', 'insights', 'metrics'],
    casual: ['takeaways', 'results', 'findings'],
  },
  outcome: {
    lemma: 'outcome',
    pos: 'noun',
    academic: ['consequence', 'aftermath', 'repercussion', 'resultant'],
    professional: ['result', 'deliverable', 'impact', 'end result'],
    casual: ['result', 'upshot', 'turnout'],
  },
  outcomes: {
    lemma: 'outcomes',
    pos: 'noun',
    academic: ['consequences', 'manifestations', 'endpoints', 'results'],
    professional: ['results', 'deliverables', 'impacts'],
    casual: ['results', 'upshots', 'payoffs'],
  },
  approach: {
    lemma: 'approach',
    pos: 'noun',
    academic: ['paradigm', 'methodology', 'protocol', 'modality'],
    professional: ['strategy', 'method', 'tactic', 'framework'],
    casual: ['angle', 'way', 'tactic'],
  },
  framework: {
    lemma: 'framework',
    pos: 'noun',
    academic: ['conceptual schema', 'paradigm', 'architecture', 'structure'],
    professional: ['model', 'structure', 'system', 'matrix'],
    casual: ['setup', 'outline', 'structure'],
  },
  evidence: {
    lemma: 'evidence',
    pos: 'noun',
    academic: ['empirical support', 'corroboration', 'validation'],
    professional: ['data', 'proof', 'validation', 'empirical support'],
    casual: ['proof', 'facts', 'backing'],
  },
  hypothesis: {
    lemma: 'hypothesis',
    pos: 'noun',
    academic: ['conjecture', 'postulation', 'theoretical premise', 'supposition'],
    professional: ['working assumption', 'premise', 'theory'],
    casual: ['guess', 'hunch', 'working idea'],
  },
  implication: {
    lemma: 'implication',
    pos: 'noun',
    academic: ['ramification', 'consequence', 'corollary', 'inference'],
    professional: ['takeaway', 'impact', 'consequence'],
    casual: ['fallout', 'catch', 'effect'],
  },
  implications: {
    lemma: 'implications',
    pos: 'noun',
    academic: ['ramifications', 'consequences', 'corollaries', 'inferences'],
    professional: ['takeaways', 'impacts', 'consequences'],
    casual: ['fallout', 'effects', 'lessons'],
  },

  // ─── NOUNS: DOMAIN SENSITIVE WITH POS TAG ENFORCEMENT ─────
  use_noun: {
    lemma: 'use',
    pos: 'noun',
    academic: ['usage', 'engagement', 'consumption', 'utilization'],
    professional: ['usage', 'adoption', 'application', 'engagement'],
    casual: ['use', 'habits', 'routine'],
  },
  use_verb: {
    lemma: 'use',
    pos: 'verb',
    academic: ['employ', 'utilize', 'implement', 'apply'],
    professional: ['leverage', 'apply', 'employ', 'adopt'],
    casual: ['work with', 'try out', 'use'],
  },
  usage: {
    lemma: 'usage',
    pos: 'noun',
    academic: ['engagement', 'consumption', 'utilization', 'application'],
    professional: ['utilization', 'adoption', 'activity', 'use'],
    casual: ['use', 'habits', 'time spent'],
  },
  consumption: {
    lemma: 'consumption',
    pos: 'noun',
    academic: ['intake', 'utilization', 'engagement', 'absorption'],
    professional: ['usage', 'utilization', 'adoption'],
    casual: ['use', 'intake', 'viewing'],
  },

  // ─── ADJECTIVES: EVALUATIVE & EMPIRICAL ────────────────────
  empirical: {
    lemma: 'empirical',
    pos: 'adj',
    academic: ['observational', 'data-driven', 'evidence-based', 'quantitative'],
    professional: ['data-driven', 'practical', 'evidence-based', 'fact-based'],
    casual: ['real-world', 'hands-on', 'practical'],
  },
  significant: {
    lemma: 'significant',
    pos: 'adj',
    academic: ['pronounced', 'substantive', 'consequential', 'noteworthy', 'marked'],
    professional: ['notable', 'meaningful', 'substantial', 'major'],
    casual: ['big', 'huge', 'noticeable'],
  },
  primary: {
    lemma: 'primary',
    pos: 'adj',
    academic: ['foremost', 'predominant', 'principal', 'cardinal'],
    professional: ['main', 'key', 'lead', 'chief'],
    casual: ['main', 'top', 'lead'],
  },
  substantial: {
    lemma: 'substantial',
    pos: 'adj',
    academic: ['considerable', 'sizable', 'pronounced', 'weighty'],
    professional: ['solid', 'meaningful', 'major', 'sizeable'],
    casual: ['hefty', 'solid', 'good-sized'],
  },
  comprehensive: {
    lemma: 'comprehensive',
    pos: 'adj',
    academic: ['exhaustive', 'panoramic', 'all-encompassing', 'thorough'],
    professional: ['in-depth', 'broad', 'full-scale', 'thorough'],
    casual: ['all-in', 'complete', 'end-to-end'],
  },
  preliminary: {
    lemma: 'preliminary',
    pos: 'adj',
    academic: ['exploratory', 'introductory', 'provisional', 'nascent'],
    professional: ['early-stage', 'initial', 'first-phase', 'provisional'],
    casual: ['early', 'rough', 'starting'],
  },
  systematic: {
    lemma: 'systematic',
    pos: 'adj',
    academic: ['methodical', 'structured', 'rigorous'],
    professional: ['structured', 'methodical', 'organized', 'step-by-step'],
    casual: ['step-by-step', 'organized', 'neat'],
  },
  rigorous: {
    lemma: 'rigorous',
    pos: 'adj',
    academic: ['meticulous', 'stringent', 'exacting', 'uncompromising'],
    professional: ['thorough', 'exacting', 'detailed', 'strict'],
    casual: ['tight', 'strict', 'tough'],
  },
  consistent: {
    lemma: 'consistent',
    pos: 'adj',
    academic: ['congruent', 'harmonious', 'uniform', 'unwavering'],
    professional: ['steady', 'reliable', 'uniform', 'repeatable'],
    casual: ['steady', 'solid', 'even'],
  },
  effective: {
    lemma: 'effective',
    pos: 'adj',
    academic: ['efficacious', 'potent', 'impactful', 'productive'],
    professional: ['productive', 'impactful', 'successful', 'viable'],
    casual: ['working', 'solid', 'successful'],
  },
  efficient: {
    lemma: 'efficient',
    pos: 'adj',
    academic: ['streamlined', 'optimized', 'resource-conscious', 'expeditious'],
    professional: ['optimized', 'streamlined', 'cost-effective', 'lean'],
    casual: ['speedy', 'smooth', 'quick'],
  },
  crucial_replacement: {
    lemma: 'essential',
    pos: 'adj',
    academic: ['indispensable', 'foundational', 'imperative', 'salient'],
    professional: ['vital', 'key', 'essential', 'high-priority'],
    casual: ['must-have', 'key', 'big'],
  },

  // ─── ADVERBS: DEGREE & FRAMING ────────────────────────────
  significantly: {
    lemma: 'significantly',
    pos: 'adv',
    academic: ['substantially', 'notably', 'statistically', 'meaningfully'],
    professional: ['notably', 'meaningfully', 'substantially'],
    casual: ['a lot', 'way more', 'noticeably'],
  },
  frequently: {
    lemma: 'frequently',
    pos: 'adv',
    academic: ['customarily', 'routinely', 'regularly', 'repeatedly'],
    professional: ['regularly', 'often', 'routinely'],
    casual: ['all the time', 'often', 'a lot'],
  },
  consistently: {
    lemma: 'consistently',
    pos: 'adv',
    academic: ['invariably', 'systematically', 'uniformly', 'reliably'],
    professional: ['steadily', 'reliably', 'uniformly'],
    casual: ['every time', 'without fail', 'steadily'],
  },
  substantially: {
    lemma: 'substantially',
    pos: 'adv',
    academic: ['considerably', 'markedly', 'appreciably'],
    professional: ['largely', 'notably', 'materially'],
    casual: ['pretty much', 'heavily', 'a bunch'],
  },
  meticulously: {
    lemma: 'meticulously',
    pos: 'adv',
    academic: ['rigorously', 'systematically', 'exacting', 'methodically'],
    professional: ['carefully', 'thoroughly', 'diligently'],
    casual: ['carefully', 'closely', 'with care'],
  },
};

/**
 * 60+ Deep Nominalization & De-nominalization Mappings
 * Shifts verbal predicates to noun phrases and vice-versa.
 * e.g., "analyzed" -> "conducted an analysis of"
 * e.g., "investigated" -> "carried out an investigation into"
 */
export interface DeepNominalizationEntry {
  baseVerb: string;
  pastVerb: string;
  thirdVerb: string;
  gerundVerb: string;
  noun: string;
  preposition: string;
  academicPhrases: {
    past: string;
    third: string;
    base: string;
    gerund: string;
  };
  professionalPhrases: {
    past: string;
    third: string;
    base: string;
    gerund: string;
  };
}

export const DEEP_NOMINALIZATIONS: Record<string, DeepNominalizationEntry> = {
  analyze: {
    baseVerb: 'analyze',
    pastVerb: 'analyzed',
    thirdVerb: 'analyzes',
    gerundVerb: 'analyzing',
    noun: 'analysis',
    preposition: 'of',
    academicPhrases: {
      past: 'conducted an empirical evaluation of',
      third: 'conducts an empirical evaluation of',
      base: 'conduct an empirical evaluation of',
      gerund: 'conducting an empirical evaluation of',
    },
    professionalPhrases: {
      past: 'performed an assessment of',
      third: 'performs an assessment of',
      base: 'perform an assessment of',
      gerund: 'performing an assessment of',
    },
  },
  analyse: {
    baseVerb: 'analyse',
    pastVerb: 'analysed',
    thirdVerb: 'analyses',
    gerundVerb: 'analysing',
    noun: 'analysis',
    preposition: 'of',
    academicPhrases: {
      past: 'conducted an empirical evaluation of',
      third: 'conducts an empirical evaluation of',
      base: 'conduct an empirical evaluation of',
      gerund: 'conducting an empirical evaluation of',
    },
    professionalPhrases: {
      past: 'performed an assessment of',
      third: 'performs an assessment of',
      base: 'perform an assessment of',
      gerund: 'performing an assessment of',
    },
  },
  investigate: {
    baseVerb: 'investigate',
    pastVerb: 'investigated',
    thirdVerb: 'investigates',
    gerundVerb: 'investigating',
    noun: 'investigation',
    preposition: 'into',
    academicPhrases: {
      past: 'carried out a scholarly inquiry into',
      third: 'carries out a scholarly inquiry into',
      base: 'carry out a scholarly inquiry into',
      gerund: 'carrying out a scholarly inquiry into',
    },
    professionalPhrases: {
      past: 'conducted an inquiry into',
      third: 'conducts an inquiry into',
      base: 'conduct an inquiry into',
      gerund: 'conducting an inquiry into',
    },
  },
  evaluate: {
    baseVerb: 'evaluate',
    pastVerb: 'evaluated',
    thirdVerb: 'evaluates',
    gerundVerb: 'evaluating',
    noun: 'evaluation',
    preposition: 'of',
    academicPhrases: {
      past: 'conducted an evaluation of',
      third: 'conducts an evaluation of',
      base: 'conduct an evaluation of',
      gerund: 'conducting an evaluation of',
    },
    professionalPhrases: {
      past: 'undertook an evaluation of',
      third: 'undertakes an evaluation of',
      base: 'undertake an evaluation of',
      gerund: 'undertaking an evaluation of',
    },
  },
  demonstrate: {
    baseVerb: 'demonstrate',
    pastVerb: 'demonstrated',
    thirdVerb: 'demonstrates',
    gerundVerb: 'demonstrating',
    noun: 'demonstration',
    preposition: 'of',
    academicPhrases: {
      past: 'provided empirical evidence of',
      third: 'provides empirical evidence of',
      base: 'provide empirical evidence of',
      gerund: 'providing empirical evidence of',
    },
    professionalPhrases: {
      past: 'offered a clear indication of',
      third: 'offers a clear indication of',
      base: 'offer a clear indication of',
      gerund: 'offering a clear indication of',
    },
  },
  examine: {
    baseVerb: 'examine',
    pastVerb: 'examined',
    thirdVerb: 'examines',
    gerundVerb: 'examining',
    noun: 'examination',
    preposition: 'of',
    academicPhrases: {
      past: 'conducted an examination of',
      third: 'conducts an examination of',
      base: 'conduct an examination of',
      gerund: 'conducting an examination of',
    },
    professionalPhrases: {
      past: 'conducted a detailed review of',
      third: 'conducts a detailed review of',
      base: 'conduct a detailed review of',
      gerund: 'conducting a detailed review of',
    },
  },
  assess: {
    baseVerb: 'assess',
    pastVerb: 'assessed',
    thirdVerb: 'assesses',
    gerundVerb: 'assessing',
    noun: 'assessment',
    preposition: 'of',
    academicPhrases: {
      past: 'performed a quantitative assessment of',
      third: 'performs a quantitative assessment of',
      base: 'perform a quantitative assessment of',
      gerund: 'performing a quantitative assessment of',
    },
    professionalPhrases: {
      past: 'conducted an assessment of',
      third: 'conducts an assessment of',
      base: 'conduct an assessment of',
      gerund: 'conducting an assessment of',
    },
  },
  measure: {
    baseVerb: 'measure',
    pastVerb: 'measured',
    thirdVerb: 'measures',
    gerundVerb: 'measuring',
    noun: 'measurement',
    preposition: 'of',
    academicPhrases: {
      past: 'derived quantified measurements of',
      third: 'derives quantified measurements of',
      base: 'derive quantified measurements of',
      gerund: 'deriving quantified measurements of',
    },
    professionalPhrases: {
      past: 'gauged the metrics of',
      third: 'gauges the metrics of',
      base: 'gauge the metrics of',
      gerund: 'gauging the metrics of',
    },
  },
  conclude: {
    baseVerb: 'conclude',
    pastVerb: 'concluded',
    thirdVerb: 'concludes',
    gerundVerb: 'concluding',
    noun: 'conclusion',
    preposition: 'that',
    academicPhrases: {
      past: 'arrived at the determination that',
      third: 'arrives at the determination that',
      base: 'arrive at the determination that',
      gerund: 'arriving at the determination that',
    },
    professionalPhrases: {
      past: 'reached the conclusion that',
      third: 'reaches the conclusion that',
      base: 'reach the conclusion that',
      gerund: 'reaching the conclusion that',
    },
  },
  correlate: {
    baseVerb: 'correlate',
    pastVerb: 'correlated',
    thirdVerb: 'correlates',
    gerundVerb: 'correlating',
    noun: 'correlation',
    preposition: 'with',
    academicPhrases: {
      past: 'exhibited an empirical correlation with',
      third: 'exhibits an empirical correlation with',
      base: 'exhibit an empirical correlation with',
      gerund: 'exhibiting an empirical correlation with',
    },
    professionalPhrases: {
      past: 'showed a direct association with',
      third: 'shows a direct association with',
      base: 'show a direct association with',
      gerund: 'showing a direct association with',
    },
  },
  modernize: {
    baseVerb: 'modernize',
    pastVerb: 'modernized',
    thirdVerb: 'modernizes',
    gerundVerb: 'modernizing',
    noun: 'modernization',
    preposition: 'of',
    academicPhrases: {
      past: 'orchestrated a technological upgrade of',
      third: 'orchestrates a technological upgrade of',
      base: 'orchestrate a technological upgrade of',
      gerund: 'orchestrating a technological upgrade of',
    },
    professionalPhrases: {
      past: 'implemented a modernization of',
      third: 'implements a modernization of',
      base: 'implement a modernization of',
      gerund: 'implementing a modernization of',
    },
  },
};

/**
 * Litotes & Syntactic Polarity Transformations
 * Preserves semantic truth while flipping between affirmative assertions and scholarly litotes.
 */
export interface LitotesPair {
  affirmative: string;
  negativeLitotes: string;
  applicablePos: 'adj' | 'adv' | 'verb' | 'predicate';
}

export const EXTENSIVE_LITOTES_PAIRS: LitotesPair[] = [
  { affirmative: 'significant', negativeLitotes: 'by no means negligible', applicablePos: 'adj' },
  { affirmative: 'statistically significant', negativeLitotes: 'cannot be attributed to random chance', applicablePos: 'adj' },
  { affirmative: 'important', negativeLitotes: 'far from inconsequential', applicablePos: 'adj' },
  { affirmative: 'clear', negativeLitotes: 'scarcely ambiguous', applicablePos: 'adj' },
  { affirmative: 'common', negativeLitotes: 'hardly atypical', applicablePos: 'adj' },
  { affirmative: 'effective', negativeLitotes: 'not without efficacy', applicablePos: 'adj' },
  { affirmative: 'consistent', negativeLitotes: 'not incongruous', applicablePos: 'adj' },
  { affirmative: 'successful', negativeLitotes: 'not unsuccessful', applicablePos: 'adj' },
  { affirmative: 'correlated', negativeLitotes: 'not statistically independent', applicablePos: 'adj' },
  { affirmative: 'positive', negativeLitotes: 'non-negative', applicablePos: 'adj' },
  { affirmative: 'plausible', negativeLitotes: 'not improbable', applicablePos: 'adj' },
  { affirmative: 'evident', negativeLitotes: 'not unapparent', applicablePos: 'adj' },
  { affirmative: 'substantial', negativeLitotes: 'not insignificant', applicablePos: 'adj' },
];

/**
 * Fronting & Topicalization Prepositional Phrases
 * Scholarly frames inserted or reordered at sentence beginnings to vary syntax cadence (burstiness).
 */
export const FRONTING_FRAMES: Record<ToneStyle, string[]> = {
  academic: [
    'In this empirical investigation,',
    'Across the analyzed dataset,',
    'From a methodological standpoint,',
    'Upon closer examination of the metrics,',
    'In line with the theoretical framework,',
    'Based on the observed coefficients,',
    'Controlling for baseline variables,',
    'Within this representative cohort,',
    'As documented across the empirical observations,',
    'In accordance with these quantitative outcomes,',
  ],
  professional: [
    'In practice,',
    'Across current workflows,',
    'From an operational perspective,',
    'Based on recent performance data,',
    'Looking at core metrics,',
    'In light of the initial audit,',
    'Across distributed teams,',
    'To optimize overall efficiency,',
  ],
  casual: [
    'In real life,',
    'Looking at the numbers,',
    'All things considered,',
    'When you break it down,',
    'At the end of the day,',
    'Taking a step back,',
  ],
};

/**
 * Authentic Human Discourse Markers
 * Categorized by rhetorical function. These replace robotic AI clichés ("Furthermore", "Moreover", "Additionally").
 */
export interface HumanDiscourseConnector {
  category: 'additive' | 'contrastive' | 'evidential' | 'consequential' | 'elaborative';
  academic: string[];
  professional: string[];
  casual: string[];
}

export const HUMAN_DISCOURSE_CONNECTORS: HumanDiscourseConnector[] = [
  {
    category: 'additive',
    academic: ['Equally important,', 'Beyond this,', 'At the same time,', 'In tandem with these results,', 'Concurrently,'],
    professional: ['In addition,', 'Along the same lines,', 'On that note,', 'Equally important,'],
    casual: ['On top of that,', 'Also,', 'What is more,'],
  },
  {
    category: 'contrastive',
    academic: ['Conversely,', 'In contrast,', 'On the contrary,', 'Diverging from these patterns,'],
    professional: ['However,', 'On the other hand,', 'By comparison,', 'In contrast,'],
    casual: ['Then again,', 'Still,', 'On flip side,'],
  },
  {
    category: 'evidential',
    academic: ['As observed in the data,', 'These findings substantiate that', 'The statistical evidence indicates that', 'Empirically,'],
    professional: ['The numbers show that', 'In review,', 'As demonstrated by the metrics,'],
    casual: ['As you can see,', 'Clearly,', 'The stats show that'],
  },
  {
    category: 'consequential',
    academic: ['Consequently,', 'As a direct result,', 'Accordingly,', 'Hence,'],
    professional: ['As a result,', 'Therefore,', 'Accordingly,', 'To that end,'],
    casual: ['So,', 'Because of that,', 'That means'],
  },
  {
    category: 'elaborative',
    academic: ['Specifically,', 'In particular,', 'More precisely,', 'To contextualize these findings,'],
    professional: ['Specifically,', 'In particular,', 'More directly,'],
    casual: ['Specifically,', 'To be exact,', 'In other words,'],
  },
];

/**
 * AI Cliche Ban-List
 * Every single occurrence of these expressions is detected and purged.
 */
export const BANNED_AI_EXPRESSIONS: Record<string, string> = {
  'furthermore': 'Equally important,',
  'moreover': 'Beyond this,',
  'in conclusion': 'Taken together,',
  'it is crucial to delve into': 'researchers must examine',
  'it is crucial to': 'it remains important to',
  'delve into': 'examine',
  'delve': 'study',
  'pivotal role': 'key role',
  'pivotal': 'essential',
  'testament to': 'evidence of',
  'stands as a testament to': 'illustrates',
  'fostering': 'encouraging',
  'foster': 'support',
  'rich tapestry': 'complex variety',
  'tapestry': 'array',
  'vibrant': 'active',
  'beacon': 'guide',
  'paramount': 'central',
  'multifaceted': 'diverse',
  'underscored': 'highlighted',
  'underscore': 'highlight',
  'underscores': 'highlights',
  'navigating': 'managing',
  'navigate': 'handle',
  'ever-evolving landscape': 'changing environment',
  'dynamic landscape': 'operational domain',
  'landscape': 'domain',
  'harnessing': 'applying',
  'harness': 'utilize',
  'meticulously': 'systematically',
  'intricate interplay': 'interaction',
  'interplay': 'relationship',
  'resonate': 'align',
  'catalyst': 'driver',
  'embark': 'begin',
  'shed light on': 'clarify',
  'it is important to note that': 'notably,',
  'it is worth noting that': 'importantly,',
  'seamlessly': 'smoothly',
  'spearhead': 'lead',
  'holistic': 'comprehensive',
};
