/**
 * Voice Transformer: Deterministic grammatical algorithm for switching
 * between Passive and Active voice.
 */

import { VERB_FORMS, VerbVoiceForms } from './lexicon';

export interface VoiceDetectionResult {
  voice: 'active' | 'passive' | 'neutral';
  auxiliary?: string;
  verbLemma?: string;
  participle?: string;
  agent?: string;
  patient?: string;
  remainder?: string;
  matchedRule?: string;
}

export interface VoiceTransformResult {
  transformedText: string;
  wasTransformed: boolean;
  originalVoice: 'active' | 'passive' | 'neutral';
  targetVoice: 'active' | 'passive';
  explanation: string;
}

// Auxiliaries indicating passive voice
const PASSIVE_AUXILIARIES = [
  'is', 'are', 'was', 'were', 'has been', 'have been', 'had been',
  'will be', 'is being', 'are being', 'was being', 'were being',
];

// Stative participles and predicate adjectives that represent states or relationships, NOT action passives
const STATIVE_PARTICIPLES = new Set([
  'associated', 'related', 'correlated', 'linked', 'based', 'located',
  'composed', 'involved', 'situated', 'interested', 'consistent', 'equipped',
]);

// Main active research verbs that indicate the overall sentence is active
const ACTIVE_RESEARCH_VERBS_REGEX = /\b(support|supports|supported|suggest|suggests|suggested|indicate|indicates|indicated|demonstrate|demonstrates|demonstrated|show|shows|showed|find|finds|found|reveal|reveals|revealed|report|reports|reported|contain|contains|contained|identify|identifies|identified|conclude|concludes|concluded)\b/i;

// Subordinating connectors that introduce subordinate clauses
const SUBORDINATE_MARKERS_REGEX = /\b(that|which|who|whom|whose|because|although|if|while|whereas|since|where|when|after|before)\b/i;

// Helper: check if a word is capitalized
function isCapitalized(str: string): boolean {
  return str.length > 0 && str[0] === str[0].toUpperCase() && str[0] !== str[0].toLowerCase();
}

// Capitalize first letter, keep rest intact
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Lowercase first letter
function uncapitalize(str: string): string {
  if (!str) return '';
  // Don't uncapitalize proper nouns or 'I'
  if (str.startsWith('I ') || str === 'I') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// Pronoun object <-> subject mapping
const PRONOUN_OBJ_TO_SUBJ: Record<string, string> = {
  me: 'I',
  him: 'he',
  her: 'she',
  them: 'they',
  us: 'we',
  whom: 'who',
};

const PRONOUN_SUBJ_TO_OBJ: Record<string, string> = {
  i: 'me',
  he: 'him',
  she: 'her',
  they: 'them',
  we: 'us',
  who: 'whom',
};

/**
 * Detect whether a sentence is in Passive, Active, or Neutral voice.
 */
export function detectVoice(sentence: string): VoiceDetectionResult {
  const trimmed = sentence.trim().replace(/[.!?]+$/, '');

  // Check 0: If the sentence has an obvious main clause active verb (e.g. "The findings do not support", "The authors suggest", "The dataset contained")
  // it is unequivocally an ACTIVE sentence. Never mistake a subordinate passive clause for the main voice!
  const hasLeadingActiveVerb = /\b(?:do not|does not|did not|cannot|could not|will not)\s+(?:support|indicate|show|demonstrate|reveal|suggest|find)\b/i.test(trimmed) ||
    /^(?:the|this|these|our|their|prior)\s+[a-z\s-]+\s+(?:supports|supported|suggests|suggested|indicates|indicated|demonstrates|demonstrated|shows|showed|found|reveals|revealed|contained|identifies|identified|concludes|concluded)\b/i.test(trimmed);

  if (hasLeadingActiveVerb) {
    return {
      voice: 'active',
      matchedRule: 'Active main clause with research/reporting verb',
    };
  }

  // Look for passive pattern: [Patient] + [Auxiliary] + [Participle] + (by [Agent])
  // Pattern 1: With "by [Agent]"
  for (const aux of PASSIVE_AUXILIARIES) {
    // Stop agent at coordinate conjunctions, relative clauses, or semicolons
    const auxRegex = new RegExp(
      `\\b${aux}\\s+([a-z]+ed|[a-z]+en|written|found|built|made|held)\\s+by\\s+([^,;]+?)(?=\\s*(?:,\\s*(?:and|but|which|who|while|whereas|although)|;|$|\\.))`,
      'i'
    );
    const match = trimmed.match(auxRegex);
    if (match && match.index !== undefined) {
      const participle = match[1].toLowerCase();

      // Guard: Stative participles like "associated", "related" are NOT action passives
      if (STATIVE_PARTICIPLES.has(participle)) {
        continue;
      }

      const fullPatient = trimmed.substring(0, match.index).trim();

      // Guard: Subordinate clause check (if the passive verb is after "that", "which", "because", etc.)
      if (SUBORDINATE_MARKERS_REGEX.test(fullPatient)) {
        continue;
      }

      const agent = match[2].trim();
      const matchEnd = match.index + match[0].length;
      const remainder = trimmed.substring(matchEnd).trim();

      // Find verb in lexicon or derive
      const verbLemma = Object.keys(VERB_FORMS).find(
        (key) => VERB_FORMS[key].pastParticiple === participle || VERB_FORMS[key].past === participle
      ) || participle.replace(/ed$/, '');

      return {
        voice: 'passive',
        auxiliary: aux,
        verbLemma,
        participle,
        agent,
        patient: fullPatient,
        remainder: remainder || undefined,
        matchedRule: `Auxiliary "${aux}" + participle "${participle}" + agent "by ${agent}"`,
      };
    }
  }

  // Pattern 2: Agentless passive: [Patient] + [Auxiliary] + [Participle] + [Adverb/prepositional phrase]
  // Must be in the main clause, not preceded by subordinate markers or active main verbs
  for (const aux of PASSIVE_AUXILIARIES) {
    const auxRegex = new RegExp(`^([^,;]+?)\\s+\\b${aux}\\s+([a-z]+ed|[a-z]+en|written|found|built|made|held)(.*)$`, 'i');
    const match = trimmed.match(auxRegex);
    if (match && match[1].trim().length > 0) {
      const patient = match[1].trim();
      const participle = match[2].toLowerCase();
      const remainder = match[3].trim();

      // CRITICAL GUARDS for Agentless Passive:
      // 1. Never transform stative participles (e.g. "is associated with", "was related to", "is based on")
      if (STATIVE_PARTICIPLES.has(participle) || /^(with|to|on|in|of)\b/i.test(remainder)) {
        continue;
      }

      // 2. Patient must not contain subordinate conjunctions like "that", "which", "because"
      if (SUBORDINATE_MARKERS_REGEX.test(patient)) {
        continue;
      }

      // 3. Patient must not contain main active verbs (e.g., "do not support", "suggested")
      if (ACTIVE_RESEARCH_VERBS_REGEX.test(patient)) {
        continue;
      }

      // 4. Participle must be a legitimate transitive action verb in academic/research contexts
      const validActionParticiples = new Set([
        'analyzed', 'analysed', 'examined', 'conducted', 'investigated', 'evaluated',
        'measured', 'collected', 'tested', 'observed', 'implemented', 'calculated',
        'performed', 'developed', 'prepared', 'recorded', 'utilized', 'used'
      ]);

      if (!validActionParticiples.has(participle)) {
        continue;
      }

      const verbLemma = Object.keys(VERB_FORMS).find(
        (key) => VERB_FORMS[key].pastParticiple === participle || VERB_FORMS[key].past === participle
      ) || participle.replace(/ed$/, '');

      return {
        voice: 'passive',
        auxiliary: aux,
        verbLemma,
        participle,
        patient,
        agent: 'the researchers',
        remainder,
        matchedRule: `Agentless passive: "${aux}" + "${participle}"`,
      };
    }
  }

  // Active voice detection: [Subject] + [Transitive Verb] + [Direct Object]
  for (const [lemma, forms] of Object.entries(VERB_FORMS)) {
    // Check past tense or third-person singular or base form
    const verbRegex = new RegExp(`^(.+?)\\s+\\b(${forms.past}|${forms.thirdPerson}|${forms.base})\\s+(.+)$`, 'i');
    const match = trimmed.match(verbRegex);
    if (match) {
      const subject = match[1].trim();
      const verbMatched = match[2].toLowerCase();
      const object = match[3].trim();

      // Ensure subject is not an auxiliary like "is", "was"
      if (!PASSIVE_AUXILIARIES.some(a => subject.toLowerCase().endsWith(a))) {
        return {
          voice: 'active',
          verbLemma: lemma,
          auxiliary: forms.past === verbMatched ? 'past' : forms.thirdPerson === verbMatched ? 'present_3s' : 'present',
          agent: subject,
          patient: object,
          matchedRule: `Active transitive verb "${verbMatched}" with subject "${subject}"`,
        };
      }
    }
  }

  return { voice: 'neutral' };
}

/**
 * Convert Passive voice to Active voice
 */
export function passiveToActive(sentence: string): VoiceTransformResult {
  const endingPunctuation = sentence.match(/[.!?]+$/)?.[0] || '.';
  const detection = detectVoice(sentence);

  if (detection.voice !== 'passive' || !detection.participle || !detection.patient) {
    return {
      transformedText: sentence,
      wasTransformed: false,
      originalVoice: detection.voice,
      targetVoice: 'active',
      explanation: 'Sentence is already in active voice or has no passive verb structure.',
    };
  }

  const agentRaw = detection.agent || 'The researchers';
  let patientRaw = detection.patient;
  const aux = (detection.auxiliary || 'was').toLowerCase();
  const participle = detection.participle;

  // Check if patient contains a leading clause, e.g. "Because X, the system" or "In this study, the model"
  let leadingClausePrefix = '';
  const lastCommaIdx = patientRaw.lastIndexOf(',');
  if (lastCommaIdx !== -1) {
    leadingClausePrefix = patientRaw.substring(0, lastCommaIdx + 1).trim() + ' ';
    patientRaw = patientRaw.substring(lastCommaIdx + 1).trim();
  }

  // Resolve agent pronoun if any
  const agentWords = agentRaw.split(' ');
  const firstAgentWord = agentWords[0].toLowerCase();
  let cleanAgent = agentRaw;
  if (PRONOUN_OBJ_TO_SUBJ[firstAgentWord]) {
    cleanAgent = PRONOUN_OBJ_TO_SUBJ[firstAgentWord] + ' ' + agentWords.slice(1).join(' ');
  }

  // Resolve patient pronoun if any
  let cleanPatient = patientRaw;
  const patientLower = patientRaw.toLowerCase();
  if (PRONOUN_SUBJ_TO_OBJ[patientLower]) {
    cleanPatient = PRONOUN_SUBJ_TO_OBJ[patientLower];
  }

  // Determine active verb conjugation based on passive auxiliary
  let activeVerb = participle;
  const verbInfo = Object.values(VERB_FORMS).find(
    (v) => v.pastParticiple === participle || v.past === participle || v.base === detection.verbLemma
  );

  const isPluralAgent = /s$|they|we|both|all/i.test(cleanAgent) && !/news|series|analysis/i.test(cleanAgent);

  if (verbInfo) {
    if (aux.includes('has been') || aux.includes('have been')) {
      const perfAux = isPluralAgent ? 'have' : 'has';
      activeVerb = `${perfAux} ${verbInfo.pastParticiple}`;
    } else if (aux.includes('had been')) {
      activeVerb = `had ${verbInfo.pastParticiple}`;
    } else if (aux.includes('will be')) {
      activeVerb = `will ${verbInfo.base}`;
    } else if (aux.includes('is being') || aux.includes('are being')) {
      const progAux = isPluralAgent ? 'are' : 'is';
      activeVerb = `${progAux} ${verbInfo.gerund}`;
    } else if (aux.includes('was being') || aux.includes('were being')) {
      const progAux = isPluralAgent ? 'were' : 'was';
      activeVerb = `${progAux} ${verbInfo.gerund}`;
    } else if (aux === 'is' || aux === 'are') {
      activeVerb = isPluralAgent ? verbInfo.base : verbInfo.thirdPerson;
    } else {
      // Past simple default ('was', 'were')
      activeVerb = verbInfo.past;
    }
  } else {
    if (aux === 'was' || aux === 'were') {
      activeVerb = participle;
    }
  }

  // Format the active sentence
  const formattedAgent = leadingClausePrefix ? uncapitalize(cleanAgent) : capitalize(cleanAgent);
  const formattedPatient = uncapitalize(cleanPatient);
  const remainder = detection.remainder ? (detection.remainder.startsWith(',') || detection.remainder.startsWith(';') ? detection.remainder : ` ${detection.remainder}`) : '';

  const activeSentence = `${leadingClausePrefix}${formattedAgent} ${activeVerb} ${formattedPatient}${remainder}${endingPunctuation}`;

  return {
    transformedText: activeSentence,
    wasTransformed: true,
    originalVoice: 'passive',
    targetVoice: 'active',
    explanation: `Transformed passive to active voice: placed actor "${formattedAgent}" as grammatical subject followed by active verb "${activeVerb}".`,
  };
}

/**
 * Convert Active voice to Passive voice
 */
export function activeToPassive(sentence: string): VoiceTransformResult {
  const endingPunctuation = sentence.match(/[.!?]+$/)?.[0] || '.';
  const detection = detectVoice(sentence);

  if (detection.voice !== 'active' || !detection.patient || !detection.agent || !detection.verbLemma) {
    return {
      transformedText: sentence,
      wasTransformed: false,
      originalVoice: detection.voice,
      targetVoice: 'passive',
      explanation: 'Sentence does not have a recognizable active subject-transitive verb structure.',
    };
  }

  let subjectRaw = detection.agent;
  const objectRaw = detection.patient;
  const verbInfo = VERB_FORMS[detection.verbLemma];

  if (!verbInfo) {
    return {
      transformedText: sentence,
      wasTransformed: false,
      originalVoice: detection.voice,
      targetVoice: 'passive',
      explanation: 'Verb conjugation not found for automated passive conversion.',
    };
  }

  // Extract leading clauses from subject if any (e.g. "In this study, we" or "Because X, the team")
  let leadingClausePrefix = '';
  const lastCommaIdx = subjectRaw.lastIndexOf(',');
  if (lastCommaIdx !== -1) {
    leadingClausePrefix = subjectRaw.substring(0, lastCommaIdx + 1).trim() + ' ';
    subjectRaw = subjectRaw.substring(lastCommaIdx + 1).trim();
  }

  // Determine whether object is plural
  const isPluralObject = /s$|they|data|results|findings|these|those/i.test(objectRaw) && !/analysis|series|news/i.test(objectRaw);

  // Auxiliary choice based on active tense
  let aux = 'was';
  if (detection.auxiliary === 'past') {
    aux = isPluralObject ? 'were' : 'was';
  } else if (detection.auxiliary === 'present_3s' || detection.auxiliary === 'present') {
    aux = isPluralObject ? 'are' : 'is';
  }

  const participle = verbInfo.pastParticiple;

  // Convert subject to object pronoun if needed
  let agentObj = subjectRaw;
  const subjLower = subjectRaw.toLowerCase();
  if (PRONOUN_SUBJ_TO_OBJ[subjLower]) {
    agentObj = PRONOUN_SUBJ_TO_OBJ[subjLower];
  } else {
    agentObj = uncapitalize(subjectRaw);
  }

  const formattedObject = leadingClausePrefix ? uncapitalize(objectRaw) : capitalize(objectRaw);
  const passiveSentence = `${leadingClausePrefix}${formattedObject} ${aux} ${participle} by ${agentObj}${endingPunctuation}`;

  return {
    transformedText: passiveSentence,
    wasTransformed: true,
    originalVoice: 'active',
    targetVoice: 'passive',
    explanation: `Transformed active to passive voice: inverted patient "${formattedObject}" into sentence subject and framed agent with "by ${agentObj}".`,
  };
}
