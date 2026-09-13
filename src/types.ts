export type ToneStyle = 'professional' | 'casual' | 'academic';

export type SentenceStructure = 'preserve' | 'simple' | 'compound' | 'complex';

export type VoicePreference = 'auto' | 'active' | 'passive';

export type PolarityMode = 'preserve' | 'affirmative' | 'negative';

export type TechniqueUsed =
  | 'synonym'
  | 'word_class'
  | 'voice_active'
  | 'voice_passive'
  | 'clause_reorder'
  | 'sentence_split'
  | 'sentence_combine'
  | 'polarity_change'
  | 'structural_complexity'
  | 'fronting_topicalization'
  | 'human_discourse_marker'
  | 'litotes';

export interface WordAlternative {
  word: string;
  tone: ToneStyle;
  definition?: string;
}

export interface WordChange {
  id: string;
  original: string;
  replaced: string;
  alternatives: string[];
  technique: TechniqueUsed;
  startIndex: number;
  endIndex: number;
  isProtected?: boolean;
  notes?: string;
}

export interface SentenceData {
  id: string;
  originalText: string;
  paraphrasedText: string;
  detectedVoice: 'active' | 'passive' | 'neutral';
  appliedVoice: 'active' | 'passive' | 'neutral';
  detectedStructure: 'simple' | 'compound' | 'complex';
  appliedStructure: 'simple' | 'compound' | 'complex';
  techniques: TechniqueUsed[];
  wordChanges: WordChange[];
  rulesExplanation: string[];
  isManuallyEdited: boolean;
  paragraphIndex: number;
  sentenceIndex: number;
  isProperSentence?: boolean;
  skippedReason?: string;
}

export interface ParagraphData {
  id: string;
  originalText: string;
  paraphrasedText: string;
  sentences: SentenceData[];
  styleName?: string;
  isHeading?: boolean;
  headingLevel?: number;
  xmlNodeIndex?: number;
}

export interface TechniqueStats {
  synonymsReplaced: number;
  wordClassShifts: number;
  voiceConversions: number;
  clausesReordered: number;
  sentencesSplitOrCombined: number;
  polarityToggles: number;
  structureShifts: number;
}

export interface DocumentMetrics {
  originalWordCount: number;
  paraphrasedWordCount: number;
  wordCountDelta: number;
  percentageLengthChange: number;
  originalCharCount: number;
  paraphrasedCharCount: number;
  toneConsistencyScore: number; // 0 - 100
  readabilityBefore: number; // approximate reading grade
  readabilityAfter: number;
  techniqueStats: TechniqueStats;
  usedEngine?: 'ai' | 'local_llm' | 'rule_based';
  fallbackNotice?: string;
  // Humanizer & Anti-AI Detection Metrics
  burstinessScore?: number; // 0 - 100
  burstinessStdDev?: number; // Word count standard deviation
  burstinessRating?: 'High (Human-like)' | 'Moderate' | 'Low (AI Uniform)';
  aiClichesSanitizedCount?: number;
  sanitizedAiWords?: string[];
  domainTermsProtectedCount?: number;
  preservedDomainTerms?: string[];
  aiBypassLikelihood?: number; // 0 - 100 % (Human Authenticity / Bypass score)
  originalAiScore?: number; // 0 - 100 % (Original AI detection probability)
  originalAiCliches?: string[];
  sentenceLengths?: { original: number[]; paraphrased: number[] };
}

export interface ParaphraseProgress {
  current: number;
  total: number;
  percentage: number;
  currentParagraphIndex: number;
  stageText: string;
  isProcessing: boolean;
}

export interface LocalLlmConfig {
  endpoint: string; // e.g. "http://localhost:11434" or "http://127.0.0.1:11434"
  provider: 'ollama' | 'openai_compatible';
  modelName: string; // e.g. "gemma4", "gemma2", "gemma:7b"
  temperature: number;
  useServerProxy: boolean;
}

export interface ParaphraseConfig {
  engine: 'ai' | 'local_llm' | 'rule_based';
  tone: ToneStyle;
  structure: SentenceStructure;
  voice?: VoicePreference;
  polarity: PolarityMode;
  splitLongSentences: boolean;
  combineShortSentences: boolean;
  reorderClauses?: boolean;
  changeWordClass?: boolean;
  preserveTechnicalTerms: boolean;
  enforceBurstiness?: boolean;
  stripAiVocabulary?: boolean;
  synonymAggressiveness: 'conservative' | 'balanced' | 'dynamic';
  localLlm: LocalLlmConfig;
}

export const DEFAULT_CONFIG: ParaphraseConfig = {
  engine: 'ai',
  tone: 'academic',
  structure: 'preserve',
  voice: 'auto',
  polarity: 'preserve',
  splitLongSentences: false,
  combineShortSentences: true,
  reorderClauses: false,
  changeWordClass: true,
  preserveTechnicalTerms: true,
  enforceBurstiness: true,
  stripAiVocabulary: true,
  synonymAggressiveness: 'balanced',
  localLlm: {
    endpoint: 'http://localhost:11434',
    provider: 'ollama',
    modelName: 'gemma4',
    temperature: 0.3,
    useServerProxy: false,
  },
};

