import React from 'react';
import { ParaphraseProgress } from '../types';
import { Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ParaphraseProgressBarProps {
  progress: ParaphraseProgress | null;
  engine: 'ai' | 'local_llm' | 'rule_based';
  modelName?: string;
}

export const ParaphraseProgressBar: React.FC<ParaphraseProgressBarProps> = ({
  progress,
  engine,
  modelName,
}) => {
  if (!progress || !progress.isProcessing) {
    return null;
  }

  const engineLabel =
    engine === 'local_llm'
      ? `Local LLM (${modelName || 'Gemma'})`
      : engine === 'ai'
      ? 'Gemini Sequence-to-Sequence'
      : 'Deterministic Linguistic Engine';

  return (
    <div className="bg-slate-900 border-y border-indigo-900/60 text-white px-4 py-3 shadow-md animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Status Info */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 shrink-0">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Real-Time Paraphrasing
              </span>
              <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {engineLabel}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100 truncate mt-0.5">
              {progress.stageText || `Processing paragraph ${progress.current} of ${progress.total}...`}
            </p>
          </div>
        </div>

        {/* Right Side: Visual Meter and Counter */}
        <div className="flex items-center space-x-4 w-full sm:w-80 shrink-0">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center text-slate-300">
                <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {progress.current} / {progress.total} paragraphs
              </span>
              <span className="text-indigo-300 font-bold tabular-nums">
                {Math.min(100, Math.max(1, progress.percentage))}%
              </span>
            </div>

            {/* Visual Track */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full transition-all duration-300 ease-out shadow-sm shadow-indigo-500/50"
                style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
