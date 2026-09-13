import React, { useState } from 'react';
import { SentenceData, ToneStyle, WordChange } from '../types';
import {
  Volume2,
  Layers,
  ArrowRightLeft,
  Scissors,
  Sparkles,
  Check,
  ChevronRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { passiveToActive, activeToPassive } from '../nlp/voiceTransformer';
import {
  togglePolarity,
  changeStructure,
  reorderClauses,
  splitSentence,
  transformWordClass,
} from '../nlp/structureTransformer';

interface SentenceInspectorProps {
  sentence: SentenceData;
  tone: ToneStyle;
  onUpdateSentence: (updated: SentenceData) => void;
  onSplitSentence?: (sentenceId: string, newSentences: string[]) => void;
}

export const SentenceInspector: React.FC<SentenceInspectorProps> = ({
  sentence,
  tone,
  onUpdateSentence,
  onSplitSentence,
}) => {
  const [selectedWordChange, setSelectedWordChange] = useState<WordChange | null>(null);

  // 1-Click Passive <-> Active Voice Switch
  const handleToggleVoice = () => {
    let res;
    if (sentence.appliedVoice === 'passive' || sentence.detectedVoice === 'passive') {
      res = passiveToActive(sentence.paraphrasedText);
    } else {
      res = activeToPassive(sentence.paraphrasedText);
    }

    if (res.wasTransformed) {
      onUpdateSentence({
        ...sentence,
        paraphrasedText: res.transformedText,
        appliedVoice: res.targetVoice,
        techniques: Array.from(new Set([...sentence.techniques, res.targetVoice === 'active' ? 'voice_active' : 'voice_passive'])),
        rulesExplanation: [res.explanation, ...sentence.rulesExplanation],
        isManuallyEdited: true,
      });
    }
  };

  // 1-Click Affirmative <-> Negative Switch
  const handleTogglePolarity = () => {
    const res = togglePolarity(sentence.paraphrasedText);
    if (res.modified) {
      onUpdateSentence({
        ...sentence,
        paraphrasedText: res.text,
        techniques: Array.from(new Set([...sentence.techniques, 'polarity_change'])),
        rulesExplanation: [res.ruleExplanation || 'Inverted statement polarity', ...sentence.rulesExplanation],
        isManuallyEdited: true,
      });
    }
  };

  // 1-Click Structure Switch (Simple / Compound / Complex)
  const handleSelectStructure = (structure: 'simple' | 'compound' | 'complex') => {
    const res = changeStructure(sentence.paraphrasedText, structure, tone);
    if (res.modified) {
      onUpdateSentence({
        ...sentence,
        paraphrasedText: res.text,
        appliedStructure: structure,
        techniques: Array.from(new Set([...sentence.techniques, 'structural_complexity'])),
        rulesExplanation: [res.ruleExplanation || `Restructured into ${structure} syntax`, ...sentence.rulesExplanation],
        isManuallyEdited: true,
      });
    }
  };

  // 1-Click Clause Inversion
  const handleReorderClause = () => {
    const res = reorderClauses(sentence.paraphrasedText);
    if (res.modified) {
      onUpdateSentence({
        ...sentence,
        paraphrasedText: res.text,
        techniques: Array.from(new Set([...sentence.techniques, 'clause_reorder'])),
        rulesExplanation: [res.ruleExplanation || 'Inverted clause sequence', ...sentence.rulesExplanation],
        isManuallyEdited: true,
      });
    }
  };

  // 1-Click Word Class (Nominalization / Verbification)
  const handleToggleWordClass = () => {
    const res = transformWordClass(sentence.paraphrasedText, 'nominalize');
    if (res.modified) {
      onUpdateSentence({
        ...sentence,
        paraphrasedText: res.text,
        techniques: Array.from(new Set([...sentence.techniques, 'word_class'])),
        rulesExplanation: [res.ruleExplanation || 'Applied grammatical nominalization', ...sentence.rulesExplanation],
        isManuallyEdited: true,
      });
    }
  };

  // 1-Click Split Sentence
  const handleSplit = () => {
    const res = splitSentence(sentence.paraphrasedText);
    if (res.wasSplit && onSplitSentence) {
      onSplitSentence(sentence.id, res.sentences);
    }
  };

  // Revert Sentence to Original
  const handleRevert = () => {
    onUpdateSentence({
      ...sentence,
      paraphrasedText: sentence.originalText,
      appliedVoice: sentence.detectedVoice,
      appliedStructure: sentence.detectedStructure,
      techniques: [],
      rulesExplanation: ['Reverted to original source wording.'],
      isManuallyEdited: false,
    });
  };

  // Interactive Synonym Replacement from Popover
  const handlePickAlternative = (change: WordChange, chosenWord: string) => {
    // Replace word in text
    const regex = new RegExp(`\\b${change.replaced}\\b`, 'g');
    const updatedText = sentence.paraphrasedText.replace(regex, chosenWord);

    const updatedWordChanges = sentence.wordChanges.map((wc) =>
      wc.id === change.id ? { ...wc, replaced: chosenWord } : wc
    );

    onUpdateSentence({
      ...sentence,
      paraphrasedText: updatedText,
      wordChanges: updatedWordChanges,
      isManuallyEdited: true,
    });
    setSelectedWordChange(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
      {/* Top row: Sentence index + status badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
            {sentence.sentenceIndex + 1}
          </span>
          <span className="text-xs font-semibold text-slate-800">Sentence Analysis</span>
          {sentence.isManuallyEdited && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Customized
            </span>
          )}
        </div>

        {/* Current Voice & Structure badges */}
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              sentence.appliedVoice === 'passive'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {sentence.appliedVoice === 'passive' ? 'Passive Voice' : 'Active Voice'}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 capitalize">
            {sentence.appliedStructure} Structure
          </span>
        </div>
      </div>

      {/* Comparison: Original vs Paraphrased */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Original */}
        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Original Text:
          </span>
          <p className="text-slate-700 leading-relaxed font-times text-[14px]">{sentence.originalText}</p>
        </div>

        {/* Paraphrased */}
        <div className="p-2.5 rounded-md bg-indigo-50/50 border border-indigo-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block mb-1">
            Paraphrased (Interactive Words):
          </span>
          <p className="text-slate-900 leading-relaxed font-medium font-times text-[14px]">
            {sentence.paraphrasedText}
          </p>
        </div>
      </div>

      {/* Synonym Replacement Pills (Clickable for alternatives!) */}
      {sentence.wordChanges.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
            Synonym Replacements (Click to choose alternatives):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sentence.wordChanges.map((wc) => (
              <div key={wc.id} className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setSelectedWordChange(selectedWordChange?.id === wc.id ? null : wc)}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                    selectedWordChange?.id === wc.id
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="line-through text-slate-400 mr-1">{wc.original}</span>
                  <ArrowRightLeft className="w-2.5 h-2.5 mx-0.5 text-emerald-600" />
                  <span className="font-bold">{wc.replaced}</span>
                </button>

                {/* Popover list of alternative synonyms */}
                {selectedWordChange?.id === wc.id && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 p-1.5 text-xs animate-in fade-in zoom-in-95">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Select Alternative:
                    </div>
                    {[...new Set<string>(wc.alternatives)].map((alt: string, altIdx: number) => (
                      <button
                        key={`${alt}-${altIdx}`}
                        onClick={() => handlePickAlternative(wc, alt)}
                        className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                          wc.replaced === alt ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                        }`}
                      >
                        <span>{alt}</span>
                        {wc.replaced === alt && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1-Click Granular Transformation Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium text-[11px]">1-Click Actions:</span>

        {/* 1-Click Voice Switcher */}
        <button
          onClick={handleToggleVoice}
          className="inline-flex items-center px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium transition-colors text-[11px]"
          title="Switch between Active and Passive voice"
        >
          <Volume2 className="w-3 h-3 mr-1" />
          Switch Voice ({sentence.appliedVoice === 'passive' ? '→ Active' : '→ Passive'})
        </button>

        {/* 1-Click Polarity Inversion */}
        <button
          onClick={handleTogglePolarity}
          className="inline-flex items-center px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium transition-colors text-[11px]"
          title="Switch statement between Affirmative and Negative litotes"
        >
          <ArrowRightLeft className="w-3 h-3 mr-1" />
          Flip Polarity
        </button>

        {/* 1-Click Clause Inversion */}
        <button
          onClick={handleReorderClause}
          className="inline-flex items-center px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition-colors text-[11px]"
          title="Invert subordinate and main clause arrangements"
        >
          <ArrowRightLeft className="w-3 h-3 mr-1" />
          Invert Clauses
        </button>

        {/* 1-Click Word Class (Nominalization) */}
        <button
          onClick={handleToggleWordClass}
          className="inline-flex items-center px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium transition-colors text-[11px]"
          title="Shift verb to noun form (e.g. analyze -> conduct an analysis of)"
        >
          <Layers className="w-3 h-3 mr-1" />
          Nominalize
        </button>

        {/* 1-Click Split Sentence */}
        <button
          onClick={handleSplit}
          className="inline-flex items-center px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors text-[11px]"
          title="Split sentence at conjunction or semicolon"
        >
          <Scissors className="w-3 h-3 mr-1" />
          Split Sentence
        </button>

        {/* Structure Selector Mini-pills */}
        <div className="inline-flex rounded bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
          {(['simple', 'compound', 'complex'] as ('simple' | 'compound' | 'complex')[]).map((st) => (
            <button
              key={st}
              onClick={() => handleSelectStructure(st)}
              className={`px-1.5 py-0.5 rounded capitalize ${
                sentence.appliedStructure === st ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Revert Button */}
        <button
          onClick={handleRevert}
          className="inline-flex items-center px-2 py-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] ml-auto transition-colors"
          title="Revert sentence to original wording"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </button>
      </div>

      {/* Applied Linguistics Rule Explanations */}
      {sentence.rulesExplanation.length > 0 && (
        <div className="bg-slate-50 rounded p-2 text-[11px] text-slate-600 border border-slate-200/60 flex items-start space-x-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-700">Grammatical rule applied:</span>{' '}
            {sentence.rulesExplanation.join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};
