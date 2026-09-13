import React, { useState } from 'react';
import { ParagraphData, SentenceData, ToneStyle, WordChange } from '../types';
import { SentenceInspector } from './SentenceInspector';
import {
  Columns,
  GitCompare,
  ListOrdered,
  Copy,
  Check,
  Sparkles,
  Download,
  ArrowRightLeft,
  FileCheck,
} from 'lucide-react';

interface DocumentPreviewProps {
  paragraphs: ParagraphData[];
  tone: ToneStyle;
  onUpdateSentence: (updated: SentenceData) => void;
  onSplitSentence?: (sentenceId: string, newSentences: string[]) => void;
  onDownloadDocx: () => void;
  fileName?: string;
  isProcessing?: boolean;
  processingIndex?: number | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  paragraphs,
  tone,
  onUpdateSentence,
  onSplitSentence,
  onDownloadDocx,
  fileName,
  isProcessing,
  processingIndex,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified-diff' | 'inspector'>('side-by-side');
  const [copied, setCopied] = useState(false);
  const [activeWordChange, setActiveWordChange] = useState<{
    change: WordChange;
    sentence: SentenceData;
  } | null>(null);

  const handleCopyText = () => {
    const fullText = paragraphs.map((p) => p.paraphrasedText).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAlternative = (chosenWord: string) => {
    if (!activeWordChange) return;
    const { change, sentence } = activeWordChange;
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
    setActiveWordChange(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* View Switcher & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
          <button
            id="tab-view-side-by-side"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center ${
              viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Side-by-Side Comparison
          </button>
          <button
            id="tab-view-unified-diff"
            onClick={() => setViewMode('unified-diff')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center ${
              viewMode === 'unified-diff' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Unified Diff Highlight
          </button>
          <button
            id="tab-view-inspector"
            onClick={() => setViewMode('inspector')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors flex items-center ${
              viewMode === 'inspector' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            Sentence-by-Sentence Inspector
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-copy-paraphrased"
            onClick={handleCopyText}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Copy Text
              </>
            )}
          </button>

          <button
            id="btn-preview-download"
            onClick={onDownloadDocx}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Formatted DOCX
          </button>
        </div>
      </div>

      {/* Mode 1: Side-by-Side */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Original DOCX Layout */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original Document (Preserved Layout)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Source Word Doc</span>
            </div>
            <div className="p-6 space-y-4 text-base leading-relaxed text-slate-700 overflow-y-auto max-h-[640px] font-times bg-slate-50/20">
              {paragraphs.map((p, idx) => {
                if (p.isHeading) {
                  return (
                    <h2
                      key={p.id || idx}
                      className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 pt-2 font-times"
                    >
                      {p.originalText}
                    </h2>
                  );
                }
                return (
                  <p key={p.id || idx} className="text-slate-800 text-[15px] leading-relaxed font-times">
                    {p.originalText}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Right Column: Paraphrased DOCX Output */}
          <div className="bg-white rounded-xl border border-indigo-200 shadow-xs overflow-hidden flex flex-col relative">
            <div className="px-4 py-3 bg-indigo-50/80 border-b border-indigo-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Paraphrased Output ({tone} tone)
                </span>
              </div>
              <span className="text-[11px] text-indigo-700 font-medium">Click words to replace</span>
            </div>
            <div className="p-6 space-y-4 text-base leading-relaxed text-slate-900 overflow-y-auto max-h-[640px] font-times">
              {paragraphs.map((p, pIdx) => {
                const isCurrentTransforming = isProcessing && processingIndex === pIdx;

                if (p.isHeading) {
                  return (
                    <h2
                      key={p.id || pIdx}
                      className={`text-lg font-bold text-slate-900 border-b border-indigo-100 pb-1 pt-2 font-times transition-all ${
                        isCurrentTransforming ? 'bg-indigo-50/80 px-2 rounded-sm ring-2 ring-indigo-400' : ''
                      }`}
                    >
                      {p.paraphrasedText}
                    </h2>
                  );
                }

                return (
                  <div
                    key={p.id || pIdx}
                    className={`relative rounded-md transition-all duration-300 ${
                      isCurrentTransforming
                        ? 'bg-indigo-50/80 p-2.5 ring-2 ring-indigo-400/80 shadow-xs'
                        : 'p-0.5'
                    }`}
                  >
                    {isCurrentTransforming && (
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-700 mb-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                        <span>Paraphrasing this paragraph...</span>
                      </div>
                    )}
                    <p className="text-slate-900 text-[15px] leading-relaxed font-times select-text">
                      {p.sentences.map((sentence, sIdx) => {
                        const needsTrailingSpace =
                          sIdx < p.sentences.length - 1 &&
                          !sentence.paraphrasedText.endsWith(' ');
                        return (
                          <React.Fragment key={sentence.id}>
                            {renderInteractiveSentence(sentence, (change) =>
                              setActiveWordChange({ change, sentence })
                            )}
                            {needsTrailingSpace && ' '}
                          </React.Fragment>
                        );
                      })}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Floating Synonym Picker Popover */}
            {activeWordChange && (
              <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-4 space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700">Synonym Replacement Options</span>
                    <button
                      onClick={() => setActiveWordChange(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    Original word: <strong className="text-slate-800">{activeWordChange.change.original}</strong>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {[...new Set<string>(activeWordChange.change.alternatives)].map((alt: string, altIdx: number) => (
                      <button
                        key={`${alt}-${altIdx}`}
                        onClick={() => handleSelectAlternative(alt)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          activeWordChange.change.replaced === alt
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{alt}</span>
                        {activeWordChange.change.replaced === alt && (
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setActiveWordChange(null)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Unified Diff */}
      {viewMode === 'unified-diff' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Unified Visual Diff (Linguistic Shift Legend)
            </span>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 mr-1.5 inline-block"></span>
                Synonym Substituted
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 mr-1.5 inline-block"></span>
                Voice / Structure Shift
              </span>
              <span className="flex items-center text-rose-500 line-through">
                Original Replaced
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4 font-times text-[15px] leading-relaxed max-h-[640px] overflow-y-auto">
            {paragraphs.map((p, pIdx) => {
              if (p.isHeading) {
                return (
                  <h2 key={p.id || pIdx} className="text-base font-bold text-slate-900 border-b pb-1 font-sans">
                    {p.paraphrasedText}
                  </h2>
                );
              }
              return (
                <div key={p.id || pIdx} className="p-3 bg-slate-50/60 rounded-lg border border-slate-100 space-y-2">
                  <div className="text-slate-400 text-xs line-through">{p.originalText}</div>
                  <div className="text-slate-900 font-medium select-text">
                    {p.sentences.map((sent, sIdx) => {
                      const needsTrailingSpace =
                        sIdx < p.sentences.length - 1 &&
                        !sent.paraphrasedText.endsWith(' ');
                      return (
                        <React.Fragment key={sent.id}>
                          <span
                            className={`inline px-1 py-0.5 rounded transition-colors ${
                              sent.techniques.includes('voice_active') || sent.techniques.includes('voice_passive')
                                ? 'bg-blue-50 border border-blue-200'
                                : sent.techniques.includes('word_class')
                                ? 'bg-purple-50 border border-purple-200'
                                : sent.techniques.length > 0
                                ? 'bg-emerald-50 border border-emerald-200'
                                : ''
                            }`}
                          >
                            {sent.paraphrasedText}
                          </span>
                          {needsTrailingSpace && ' '}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Sentence-by-Sentence Inspector */}
      {viewMode === 'inspector' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 flex items-center justify-between">
            <div>
              <strong>Granular Sentence Control:</strong> Click 1-Click buttons to switch active/passive voice, flip polarity, invert clauses, or change sentence complexity on individual sentences!
            </div>
            <span className="text-[11px] font-mono text-indigo-700 font-semibold">
              {paragraphs.reduce((acc, p) => acc + p.sentences.length, 0)} Total Sentences
            </span>
          </div>

          <div className="space-y-3">
            {paragraphs.map((p) =>
              p.sentences.map((sentence) => (
                <SentenceInspector
                  key={sentence.id}
                  sentence={sentence}
                  tone={tone}
                  onUpdateSentence={onUpdateSentence}
                  onSplitSentence={onSplitSentence}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to render interactive clickable words inside a paraphrased sentence
function renderInteractiveSentence(
  sentence: SentenceData,
  onWordClick: (change: WordChange) => void
) {
  if (sentence.wordChanges.length === 0) {
    return <>{sentence.paraphrasedText}</>;
  }

  const words = sentence.paraphrasedText.split(/(\s+|[.,!?;:()"'])/);

  return (
    <>
      {words.map((w, idx) => {
        if (!w) return null;
        const cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
        const matchedChange = sentence.wordChanges.find(
          (wc) => wc.replaced.toLowerCase() === cleanW || wc.replaced.toLowerCase().includes(cleanW)
        );

        if (matchedChange && cleanW.length > 2) {
          return (
            <span
              key={`${sentence.id}-w-${idx}`}
              onClick={() => onWordClick(matchedChange)}
              className="cursor-pointer bg-emerald-50 text-emerald-900 font-semibold px-1 py-0.5 rounded hover:bg-emerald-200 hover:text-emerald-950 transition-colors border-b border-emerald-300"
              title={`Original: "${matchedChange.original}". Click to choose another synonym.`}
            >
              {w}
            </span>
          );
        }

        return <React.Fragment key={`${sentence.id}-t-${idx}`}>{w}</React.Fragment>;
      })}
    </>
  );
}
