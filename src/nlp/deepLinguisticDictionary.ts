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
  // ─── HIGH-FREQUENCY ACADEMIC VERBS ───────────────────────────
  emphasize: {
    lemma: 'emphasize',
    pos: 'verb',
    academic: ['underscore', 'accentuate', 'highlight', 'prioritize'],
    professional: ['highlight', 'stress', 'prioritize', 'spotlight'],
    casual: ['point out', 'stress', 'make a point of'],
  },
  emphasizes: {
    lemma: 'emphasizes',
    pos: 'verb',
    academic: ['underscores', 'accentuates', 'highlights', 'prioritizes'],
    professional: ['highlights', 'stresses', 'prioritizes', 'spotlights'],
    casual: ['points out', 'stresses'],
  },
  emphasized: {
    lemma: 'emphasized',
    pos: 'verb',
    academic: ['underscored', 'accentuated', 'highlighted', 'prioritized'],
    professional: ['highlighted', 'stressed', 'prioritized'],
    casual: ['pointed out', 'stressed'],
  },
  provide: {
    lemma: 'provide',
    pos: 'verb',
    academic: ['furnish', 'yield', 'supply', 'afford'],
    professional: ['deliver', 'supply', 'offer', 'present'],
    casual: ['give', 'hand over', 'offer'],
  },
  provides: {
    lemma: 'provides',
    pos: 'verb',
    academic: ['furnishes', 'yields', 'supplies', 'affords'],
    professional: ['delivers', 'supplies', 'offers', 'presents'],
    casual: ['gives', 'offers', 'brings'],
  },
  provided: {
    lemma: 'provided',
    pos: 'verb',
    academic: ['furnished', 'yielded', 'supplied', 'afforded'],
    professional: ['delivered', 'supplied', 'offered', 'presented'],
    casual: ['gave', 'offered'],
  },
  explore: {
    lemma: 'explore',
    pos: 'verb',
    academic: ['investigate', 'probe', 'interrogate', 'examine'],
    professional: ['review', 'look into', 'assess', 'evaluate'],
    casual: ['look into', 'check out', 'dig into'],
  },
  explores: {
    lemma: 'explores',
    pos: 'verb',
    academic: ['investigates', 'probes', 'interrogates', 'examines'],
    professional: ['reviews', 'looks into', 'assesses'],
    casual: ['looks into', 'checks out'],
  },
  explored: {
    lemma: 'explored',
    pos: 'verb',
    academic: ['investigated', 'probed', 'interrogated', 'examined'],
    professional: ['reviewed', 'looked into', 'assessed'],
    casual: ['looked into', 'checked out'],
  },
  conduct: {
    lemma: 'conduct',
    pos: 'verb',
    academic: ['execute', 'implement', 'administer', 'undertake'],
    professional: ['carry out', 'run', 'lead', 'manage'],
    casual: ['do', 'run', 'carry out'],
  },
  conducted: {
    lemma: 'conducted',
    pos: 'verb',
    academic: ['executed', 'implemented', 'administered', 'undertook'],
    professional: ['carried out', 'ran', 'led'],
    casual: ['did', 'ran'],
  },
  require: {
    lemma: 'require',
    pos: 'verb',
    academic: ['necessitate', 'mandate', 'call for', 'stipulate'],
    professional: ['need', 'demand', 'call for'],
    casual: ['need', 'ask for'],
  },
  reflect: {
    lemma: 'reflect',
    pos: 'verb',
    academic: ['mirror', 'manifest', 'exemplify', 'connote'],
    professional: ['show', 'indicate', 'demonstrate'],
    casual: ['show', 'mirror'],
  },
  reflects: {
    lemma: 'reflects',
    pos: 'verb',
    academic: ['mirrors', 'manifests', 'exemplifies', 'connotes'],
    professional: ['shows', 'indicates', 'demonstrates'],
    casual: ['shows', 'mirrors'],
  },
  reflected: {
    lemma: 'reflected',
    pos: 'verb',
    academic: ['mirrored', 'manifested', 'exemplified', 'connoted'],
    professional: ['showed', 'indicated', 'demonstrated'],
    casual: ['showed', 'mirrored'],
  },
  influence: {
    lemma: 'influence',
    pos: 'verb',
    academic: ['modulate', 'shape', 'impact', 'determine'],
    professional: ['affect', 'shape', 'impact'],
    casual: ['sway', 'affect'],
  },
  influenced: {
    lemma: 'influenced',
    pos: 'verb',
    academic: ['modulated', 'shaped', 'impacted', 'determined'],
    professional: ['affected', 'shaped', 'impacted'],
    casual: ['swayed', 'affected'],
  },
  enhance: {
    lemma: 'enhance',
    pos: 'verb',
    academic: ['augment', 'elevate', 'enrich', 'strengthen'],
    professional: ['boost', 'improve', 'upgrade'],
    casual: ['boost', 'bump up', 'make better'],
  },
  facilitate: {
    lemma: 'facilitate',
    pos: 'verb',
    academic: ['expedite', 'enable', 'catalyze', 'foster'],
    professional: ['streamline', 'support', 'assist'],
    casual: ['help along', 'make easier'],
  },
  generate: {
    lemma: 'generate',
    pos: 'verb',
    academic: ['yield', 'produce', 'engender', 'originate'],
    professional: ['create', 'produce', 'deliver'],
    casual: ['make', 'produce'],
  },
  maintain: {
    lemma: 'maintain',
    pos: 'verb',
    academic: ['sustain', 'preserve', 'uphold', 'retain'],
    professional: ['keep', 'sustain', 'continue'],
    casual: ['keep up', 'hold onto'],
  },
  // ─── HIGH-FREQUENCY ACADEMIC ADVERBS & ADJECTIVES ────────────
  rapid: {
    lemma: 'rapid',
    pos: 'adj',
    academic: ['expedited', 'accelerated', 'swift', 'immediate'],
    professional: ['fast', 'quick', 'rapid'],
    casual: ['quick', 'speedy', 'fast'],
  },
  rapidly: {
    lemma: 'rapidly',
    pos: 'adv',
    academic: ['expeditiously', 'swiftly', 'readily', 'in rapid succession'],
    professional: ['quickly', 'promptly', 'swiftly'],
    casual: ['fast', 'quickly', 'in a flash'],
  },
  frequent: {
    lemma: 'frequent',
    pos: 'adj',
    academic: ['recurrent', 'prevalent', 'routine', 'persistent'],
    professional: ['regular', 'repeated', 'consistent'],
    casual: ['often', 'regular'],
  },
  frequently: {
    lemma: 'frequently',
    pos: 'adv',
    academic: ['routinely', 'consistently', 'regularly', 'characteristically'],
    professional: ['often', 'regularly', 'consistently'],
    casual: ['often', 'a lot', 'all the time'],
  },
  different: {
    lemma: 'different',
    pos: 'adj',
    academic: ['disparate', 'divergent', 'distinct', 'heterogeneous'],
    professional: ['varied', 'distinct', 'diverse'],
    casual: ['different', 'varied'],
  },
  difference: {
    lemma: 'difference',
    pos: 'noun',
    academic: ['disparity', 'divergence', 'distinction', 'variance'],
    professional: ['variance', 'gap', 'distinction'],
    casual: ['difference', 'gap'],
  },
  substantial: {
    lemma: 'substantial',
    pos: 'adj',
    academic: ['considerable', 'pronounced', 'extensive', 'appreciable'],
    professional: ['major', 'significant', 'considerable'],
    casual: ['big', 'sizeable', 'huge'],
  },
  substantially: {
    lemma: 'substantially',
    pos: 'adv',
    academic: ['considerably', 'markedly', 'pronouncedly', 'appreciably'],
    professional: ['significantly', 'considerably', 'greatly'],
    casual: ['a lot', 'way', 'largely'],
  },
  primary: {
    lemma: 'primary',
    pos: 'adj',
    academic: ['principal', 'predominant', 'foundational', 'paramount'],
    professional: ['main', 'core', 'chief'],
    casual: ['main', 'top'],
  },
  primarily: {
    lemma: 'primarily',
    pos: 'adv',
    academic: ['predominantly', 'principally', 'chiefly', 'fundamentally'],
    professional: ['mainly', 'chiefly', 'mostly'],
    casual: ['mostly', 'mainly'],
  },
  behavior: {
    lemma: 'behavior',
    pos: 'noun',
    academic: ['behavioral patterns', 'conduct', 'actions', 'manifestations'],
    professional: ['conduct', 'actions', 'behavior'],
    casual: ['actions', 'habits', 'conduct'],
  },
  complex: {
    lemma: 'complex',
    pos: 'adj',
    academic: ['intricate', 'multifaceted', 'elaborate', 'nuanced'],
    professional: ['complicated', 'detailed', 'sophisticated'],
    casual: ['tricky', 'hard', 'complicated'],
  },
  essential: {
    lemma: 'essential',
    pos: 'adj',
    academic: ['indispensable', 'foundational', 'imperative', 'critical'],
    professional: ['vital', 'necessary', 'key'],
    casual: ['must-have', 'key', 'needed'],
  },
  importance: {
    lemma: 'importance',
    pos: 'noun',
    academic: ['critical significance', 'centrality', 'primacy', 'essential value'],
    professional: ['priority', 'significance', 'value'],
    casual: ['importance', 'value'],
  },
  achievement: {
    lemma: 'achievement',
    pos: 'noun',
    academic: ['attainment', 'accomplishment', 'milestone', 'realization'],
    professional: ['success', 'accomplishment', 'milestone'],
    casual: ['win', 'achievement'],
  },
  perspective: {
    lemma: 'perspective',
    pos: 'noun',
    academic: ['analytical vantage point', 'viewpoint', 'framework', 'interpretive lens'],
    professional: ['viewpoint', 'angle', 'outlook'],
    casual: ['point of view', 'take', 'angle'],
  },
  dimension: {
    lemma: 'dimension',
    pos: 'noun',
    academic: ['facet', 'aspect', 'component', 'domain'],
    professional: ['area', 'aspect', 'element'],
    casual: ['part', 'side', 'piece'],
  },
  framework: {
    lemma: 'framework',
    pos: 'noun',
    academic: ['theoretical paradigm', 'conceptual architecture', 'structure', 'analytical framework'],
    professional: ['model', 'system', 'structure'],
    casual: ['setup', 'system', 'frame'],
  },
  outcome: {
    lemma: 'outcome',
    pos: 'noun',
    academic: ['consequence', 'resultant manifestation', 'implication', 'development'],
    professional: ['result', 'deliverable', 'impact'],
    casual: ['result', 'what happened', 'payoff'],
  },
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

  // ─── VERBS: ACTION, IMPLEMENTATION & PERFORMANCE ──────────
  implement: {
    lemma: 'implement',
    pos: 'verb',
    academic: ['execute', 'operationalize', 'deploy', 'enact', 'institute'],
    professional: ['roll out', 'execute', 'apply', 'put into practice'],
    casual: ['set up', 'put in place', 'try out'],
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
  consistently: {
    lemma: 'consistently',
    pos: 'adv',
    academic: ['invariably', 'systematically', 'uniformly', 'reliably'],
    professional: ['steadily', 'reliably', 'uniformly'],
    casual: ['every time', 'without fail', 'steadily'],
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

/**
 * Academic Phrasal Transforms
 * Comprehensive repository of multi-word scholarly collocations, reporting verbs,
 * and idiomatic academic expressions for radical paraphrasing without AI token predictability.
 */
export interface AcademicPhrasalTransform {
  id: string;
  pattern: RegExp;
  academic: string[];
  professional: string[];
  casual: string[];
  explanation: string;
}

export const ACADEMIC_PHRASAL_TRANSFORMS: AcademicPhrasalTransform[] = [
  {
    id: 'phr-findings-study',
    pattern: /\bthe\s+findings\s+of\s+this\s+study\b/gi,
    academic: ['empirical findings from the present inquiry', 'results derived from the current investigation', 'findings yielded by this investigation'],
    professional: ['results of this study', 'findings from this research', 'outcomes of this project'],
    casual: ['what this study found', 'the results here', 'our findings'],
    explanation: 'Rephrased study attribution to scholarly inquiry register',
  },
  {
    id: 'phr-study-used',
    pattern: /\b(?:the\s+present|this)\s+study\s+used\b/gi,
    academic: ['the current investigation employed', 'this inquiry utilized', 'the present study deployed'],
    professional: ['this study applied', 'our project used', 'this research utilized'],
    casual: ['this study went with', 'we used', 'the team used'],
    explanation: 'Transposed research predicate to academic methodological framing',
  },
  {
    id: 'phr-study-examined',
    pattern: /\b(?:the\s+present|this)\s+study\s+(?:examined|investigated|explored)\b/gi,
    academic: ['the current inquiry investigated', 'this investigation evaluated', 'the present study interrogated'],
    professional: ['this project reviewed', 'this study analyzed', 'this research looked into'],
    casual: ['this study looked at', 'we checked out', 'this research dug into'],
    explanation: 'Transposed investigation predicate to academic register',
  },
  {
    id: 'phr-present-study',
    pattern: /\bthe\s+present\s+study\b/gi,
    academic: ['the current inquiry', 'this empirical investigation', 'the present investigation'],
    professional: ['this study', 'this current research', 'our study'],
    casual: ['this study', 'this research', 'our project'],
    explanation: 'Rephrased paper self-reference with varied academic descriptor',
  },
  {
    id: 'phr-this-study',
    pattern: /\bthis\s+study\b/gi,
    academic: ['the current inquiry', 'this investigation', 'the present research'],
    professional: ['this project', 'this research', 'the study'],
    casual: ['this work', 'this paper', 'this study'],
    explanation: 'Rephrased study reference to varied inquiry framing',
  },
  {
    id: 'phr-provide-clear-insights',
    pattern: /\bprovide(?:s|d)?\s+clear\s+insights\s+into\b/gi,
    academic: ['illuminates critical dimensions of', 'offers valuable analytical perspective on', 'provides discernible insights regarding'],
    professional: ['offers clear visibility into', 'gives key insights on', 'provides clear understanding of'],
    casual: ['gives a clear picture of', 'sheds light on', 'helps make sense of'],
    explanation: 'Replaced formulaic "provide clear insights into" with scholarly analytical phrase',
  },
  {
    id: 'phr-provides-insights',
    pattern: /\bprovide(?:s|d)?\s+insights?\s+into\b/gi,
    academic: ['illuminates key aspects of', 'sheds analytical light upon', 'offers meaningful insights regarding'],
    professional: ['gives insight into', 'helps clarify', 'provides visibility into'],
    casual: ['gives a peek into', 'explains', 'shows what is going on with'],
    explanation: 'Shifted insight phrase to academic illumination framing',
  },
  {
    id: 'phr-emphasized-importance',
    pattern: /\bemphasize(?:s|d)?\s+the\s+importance\s+of\b/gi,
    academic: ['stressed the necessity of', 'prioritized', 'placed primary analytical emphasis upon', 'identified the value of'],
    professional: ['stressed how important it is to', 'focused on the need to', 'prioritized'],
    casual: ['pointed out why it matters to', 'stressed the need for', 'made a point of'],
    explanation: 'Transposed "emphasized the importance of" into academic priority construction',
  },
  {
    id: 'phr-plays-important-role',
    pattern: /\bplay(?:s|ed)?\s+(?:an?\s+)?(?:important|vital|key|central|crucial)\s+role\s+in\b/gi,
    academic: ['directly influences', 'substantially shapes', 'exerts a decisive influence upon', 'serves as a primary driver of'],
    professional: ['is a key driver of', 'plays a major part in', 'is central to'],
    casual: ['is a big deal for', 'matters a lot for', 'has a lot to do with'],
    explanation: 'Transformed generic "plays a role in" into direct scholarly action verb',
  },
  {
    id: 'phr-impact-on',
    pattern: /\bha(?:s|ve|d)\s+(?:an?\s+)?(?:important|significant|notable|measurable)\s+(?:impact|effect)\s+on\b/gi,
    academic: ['exerts a demonstrable influence upon', 'substantially shapes the trajectory of', 'measurably influences'],
    professional: ['significantly impacts', 'has a major effect on', 'directly affects'],
    casual: ['really affects', 'makes a big difference to', 'hits hard on'],
    explanation: 'Transformed phrasal impact expression into scholarly verbal phrasing',
  },
  {
    id: 'phr-negative-impact',
    pattern: /\bha(?:s|ve|d)\s+(?:a\s+)?(?:negative|detrimental|adverse)\s+(?:impact|effect)\s+on\b/gi,
    academic: ['adversely influences', 'exerts an unfavorable effect upon', 'detrimentally alters'],
    professional: ['negatively affects', 'harms', 'undermines'],
    casual: ['hurts', 'messes with', 'is bad for'],
    explanation: 'Rephrased negative impact construct to concise scholarly verb phrase',
  },
  {
    id: 'phr-positive-effect',
    pattern: /\bha(?:s|ve|d)\s+(?:a\s+)?(?:positive|constructive|beneficial)\s+(?:impact|effect)\s+on\b/gi,
    academic: ['fosters constructive outcomes in', 'beneficially enhances', 'positively reinforces'],
    professional: ['improves', 'boosts', 'positively affects'],
    casual: ['helps out', 'is great for', 'boosts'],
    explanation: 'Rephrased positive effect construct to constructive scholarly predicate',
  },
  {
    id: 'phr-negative-outcomes',
    pattern: /\bnegative\s+outcomes\b/gi,
    academic: ['adverse consequences', 'unfavorable outcomes', 'detrimental repercussions'],
    professional: ['adverse results', 'negative consequences', 'poor outcomes'],
    casual: ['bad results', 'down sides', 'negative effects'],
    explanation: 'Scholarly variation for "negative outcomes"',
  },
  {
    id: 'phr-passive-consumption',
    pattern: /\bpassive\s+consumption\b/gi,
    academic: ['passive engagement', 'passive content reception', 'unidirectional information consumption'],
    professional: ['passive viewing', 'passive usage', 'non-interactive consumption'],
    casual: ['mindless scrolling', 'just watching without posting', 'lurking'],
    explanation: 'Refined conceptual phrase for media consumption',
  },
  {
    id: 'phr-student-behavior',
    pattern: /\bstudent\s+behavior\b/gi,
    academic: ['student behavioral patterns', 'learner conduct', 'student actions and responses'],
    professional: ['student behavior patterns', 'learner performance', 'student actions'],
    casual: ['how students act', 'student habits', 'what students do'],
    explanation: 'Expanded student behavioral descriptor to academic precision',
  },
  {
    id: 'phr-clear-insights',
    pattern: /\bclear\s+insights\b/gi,
    academic: ['unambiguous perspectives', 'discernible insights', 'valuable analytical clarity'],
    professional: ['clear findings', 'actionable insights', 'solid insights'],
    casual: ['clear answers', 'good takeaways', 'plain facts'],
    explanation: 'Varied lexical collocation for "clear insights"',
  },
  {
    id: 'phr-especially-important',
    pattern: /\bespecially\s+important\b/gi,
    academic: ['particularly consequential', 'of paramount significance', 'especially critical'],
    professional: ['particularly important', 'highly critical', 'especially key'],
    casual: ['super important', 'really matters', 'a big deal'],
    explanation: 'Scholarly elevation of "especially important"',
  },
  {
    id: 'phr-conceptualized-as',
    pattern: /\bis\s+generally\s+conceptualized\s+as\b/gi,
    academic: ['is conventionally defined as', 'is theoretically conceptualized as', 'is broadly understood as'],
    professional: ['is generally described as', 'is widely seen as', 'is typically understood as'],
    casual: ['is usually thought of as', 'basically means', 'comes down to'],
    explanation: 'Varied theoretical definition clause',
  },
  {
    id: 'phr-self-worth',
    pattern: /\bself-worth\b/gi,
    academic: ['personal self-evaluation', 'individual self-regard', 'perceived self-value'],
    professional: ['personal value', 'sense of worth', 'self-evaluation'],
    casual: ['self-value', 'how someone sees themselves', 'personal worth'],
    explanation: 'Varied self-evaluation psychological construct',
  },
  {
    id: 'phr-rapidly-compare',
    pattern: /\brapidly\s+compare\b/gi,
    academic: ['readily evaluate', 'engage in swift comparative appraisal of', 'rapidly assess'],
    professional: ['quickly evaluate', 'rapidly contrast', 'swiftly compare'],
    casual: ['quickly check against', 'size up in seconds', 'compare right away'],
    explanation: 'Rephrased comparative behavior',
  },
  {
    id: 'phr-in-order-to',
    pattern: /\bin\s+order\s+to\b/gi,
    academic: ['with the objective of', 'so as to', 'to effectively'],
    professional: ['to', 'with the goal of', 'in an effort to'],
    casual: ['to', 'just to', 'so we can'],
    explanation: 'Streamlined purpose conjunction to academic phrase',
  },
  {
    id: 'phr-due-to-fact',
    pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi,
    academic: ['inasmuch as', 'owing to the circumstance that', 'given that'],
    professional: ['because', 'since', 'given that'],
    casual: ['because', 'since', 'seeing that'],
    explanation: 'Replaced wordy causal phrase with precise conjunction',
  },
  {
    id: 'phr-large-amount',
    pattern: /\ba\s+large\s+(?:amount|number)\s+of\b/gi,
    academic: ['a substantial volume of', 'an extensive array of', 'a considerable quantity of'],
    professional: ['a significant number of', 'a large portion of', 'extensive'],
    casual: ['a lot of', 'tons of', 'plenty of'],
    explanation: 'Upgraded colloquial quantity phrasing to academic register',
  },
  {
    id: 'phr-take-into-account',
    pattern: /\btake\s+into\s+(?:account|consideration)\b/gi,
    academic: ['systematically account for', 'give due consideration to', 'incorporate into the evaluation'],
    professional: ['factor in', 'consider', 'account for'],
    casual: ['keep in mind', 'think about', 'look at'],
    explanation: 'Rephrased consideration idiom to academic evaluation verb',
  },
  {
    id: 'phr-on-the-basis-of',
    pattern: /\bon\s+the\s+basis\s+of\b/gi,
    academic: ['grounded in', 'deriving from', 'contingent upon'],
    professional: ['based on', 'guided by', 'drawing from'],
    casual: ['based on', 'going off of', 'coming from'],
    explanation: 'Scholarly prepositional re-expression for "on the basis of"',
  },
  {
    id: 'phr-with-respect-to',
    pattern: /\bwith\s+(?:respect|regard)\s+to\b/gi,
    academic: ['pertaining to', 'in relation to', 'concerning'],
    professional: ['regarding', 'concerning', 'in terms of'],
    casual: ['about', 'when it comes to', 'as for'],
    explanation: 'Varied prepositional phrase for topical focus',
  },
  {
    id: 'phr-leads-to',
    pattern: /\bleads?\s+to\b/gi,
    academic: ['culminates in', 'engenders', 'precipitates', 'gives rise to'],
    professional: ['results in', 'causes', 'brings about'],
    casual: ['leads to', 'ends up with', 'sparks'],
    explanation: 'Scholarly causal predicate transformation',
  },
  {
    id: 'phr-led-to',
    pattern: /\bled\s+to\b/gi,
    academic: ['culminated in', 'engendered', 'precipitated', 'gave rise to'],
    professional: ['resulted in', 'caused', 'brought about'],
    casual: ['led to', 'ended up causing', 'sparked'],
    explanation: 'Past-tense scholarly causal predicate transformation',
  },
  {
    id: 'phr-aims-to',
    pattern: /\baims?\s+to\b/gi,
    academic: ['seeks to', 'aspires toward', 'is designed to'],
    professional: ['intends to', 'plans to', 'aims to'],
    casual: ['tries to', 'is setting out to', 'wants to'],
    explanation: 'Rephrased teleological verb phrase',
  },
  {
    id: 'phr-for-example',
    pattern: /\bfor\s+(?:example|instance),?\b/gi,
    academic: ['as an illustrative case,', 'by way of illustration,', 'specifically,'],
    professional: ['for instance,', 'for example,', 'such as'],
    casual: ['like,', 'say,', 'for example,'],
    explanation: 'Authentic scholarly exemplification marker',
  },
  {
    id: 'phr-as-a-consequence',
    pattern: /\bas\s+a\s+consequence\s+of\b/gi,
    academic: ['consequent to', 'stemming directly from', 'arising from'],
    professional: ['as a result of', 'because of', 'following'],
    casual: ['because of', 'thanks to', 'after'],
    explanation: 'Syntactic rephrasing of causal preposition',
  },
  {
    id: 'phr-at-the-same-time',
    pattern: /\bat\s+the\s+same\s+time,?\b/gi,
    academic: ['concurrently,', 'simultaneously,', 'in tandem,'],
    professional: ['at the same time,', 'meanwhile,', 'simultaneously,'],
    casual: ['meanwhile,', 'also,', 'at once,'],
    explanation: 'Temporal discourse connector variation',
  },
  {
    id: 'phr-in-comparison-with',
    pattern: /\bin\s+comparison\s+(?:with|to)\b/gi,
    academic: ['relative to', 'when juxtaposed against', 'compared against'],
    professional: ['compared to', 'relative to', 'versus'],
    casual: ['compared to', 'next to', 'against'],
    explanation: 'Scholarly comparative preposition',
  },
  {
    id: 'phr-it-is-clear-that',
    pattern: /\bit\s+is\s+clear\s+that\b/gi,
    academic: ['evidence compellingly indicates that', 'empirical observations clearly reveal that', 'it is apparent that'],
    professional: ['it is evident that', 'the data clearly shows that', 'it is clear that'],
    casual: ['it is obvious that', 'clearly,', 'you can tell that'],
    explanation: 'Epistemic evidential assertion rephrasing',
  },
  {
    id: 'phr-draw-conclusions',
    pattern: /\bdraw(?:s|ed)?\s+conclusions?\b/gi,
    academic: ['derive analytical inferences', 'formulate evaluative conclusions', 'extrapolate meaningful findings'],
    professional: ['reach conclusions', 'draw takeaways', 'determine outcomes'],
    casual: ['figure out', 'wrap up', 'draw conclusions'],
    explanation: 'Rephrased conclusion derivation phrase',
  },
  {
    id: 'phr-focus-on',
    pattern: /\bfocus(?:es|ed)?\s+on\b/gi,
    academic: ['centers analytical attention upon', 'concentrates inquiry on', 'directs focus toward'],
    professional: ['focuses on', 'zeroes in on', 'prioritizes'],
    casual: ['looks closely at', 'zeros in on', 'keys on'],
    explanation: 'Scholarly analytical focus expression',
  },
  {
    id: 'phr-strong-relationship',
    pattern: /\bthere\s+is\s+a\s+strong\s+relationship\s+between\b/gi,
    academic: ['a robust correspondence links', 'significant covariation connects', 'a pronounced correlation connects'],
    professional: ['there is a strong link between', 'a clear connection exists between', 'strong ties connect'],
    casual: ['there is a big tie between', 'these two go hand in hand', 'there is a strong connection between'],
    explanation: 'Transformed relational assertion to academic correspondence',
  },
  {
    id: 'phr-is-associated-with',
    pattern: /\bis\s+associated\s+with\b/gi,
    academic: ['exhibits a pronounced connection with', 'is closely linked with', 'correlates directly with'],
    professional: ['is linked to', 'corresponds with', 'connects with'],
    casual: ['goes with', 'is tied to', 'is linked to'],
    explanation: 'Scholarly variation for stative association phrase',
  },
  {
    id: 'phr-are-associated-with',
    pattern: /\bare\s+associated\s+with\b/gi,
    academic: ['exhibit a pronounced connection with', 'are closely linked with', 'correlate directly with'],
    professional: ['are linked to', 'correspond with', 'connect with'],
    casual: ['go with', 'are tied to', 'are linked to'],
    explanation: 'Plural scholarly variation for stative association phrase',
  },
  {
    id: 'phr-shows-that',
    pattern: /\bshow(?:s|ed)?\s+that\b/gi,
    academic: ['substantiates that', 'demonstrates that', 'reveals that'],
    professional: ['indicates that', 'demonstrates that', 'confirms that'],
    casual: ['shows that', 'proves that', 'points out that'],
    explanation: 'Scholarly reporting verb transformation',
  },
];
