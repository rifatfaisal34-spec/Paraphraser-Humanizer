import React from 'react';
import { DocumentMetrics, ToneStyle } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Percent,
  BookOpen,
  ArrowRight,
  Shuffle,
  Volume2,
  GitFork,
  CheckCircle2,
} from 'lucide-react';

interface MetricsBarProps {
  metrics: DocumentMetrics;
  targetTone: ToneStyle;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, targetTone }) => {
  const isExpansion = metrics.percentageLengthChange > 0;
  const isReduction = metrics.percentageLengthChange < 0;
  const absLengthChange = Math.abs(metrics.percentageLengthChange);

  // Normalization for visual length change bar (0-100% representation where 50% is identical length)
  // Max scale ±50%
  const lengthBarPercent = Math.min(100, Math.max(0, 50 + (metrics.percentageLengthChange / 50) * 50));

  const getToneBadge = () => {
    switch (targetTone) {
      case 'academic':
        return { label: 'Academic Rigor', color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'casual':
        return { label: 'Casual Register', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      default:
        return { label: 'Professional Standard', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
  };

  const toneBadge = getToneBadge();

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top metrics summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Word Count & Length Delta */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Length Dynamics</span>
              {isExpansion ? (
                <span className="flex items-center text-indigo-600 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{absLengthChange}%
                </span>
              ) : isReduction ? (
                <span className="flex items-center text-emerald-600 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  -{absLengthChange}%
                </span>
              ) : (
                <span className="text-slate-600 font-semibold">0% (Exact)</span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-slate-900">{metrics.paraphrasedWordCount}</span>
              <span className="text-xs text-slate-500">words</span>
              <span className="text-xs text-slate-400">
                (was {metrics.originalWordCount})
              </span>
            </div>
            {/* Length change progress bar */}
            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isExpansion ? 'bg-indigo-500' : isReduction ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, (metrics.paraphrasedWordCount / Math.max(1, metrics.originalWordCount * 1.5)) * 100))}%` }}
              />
            </div>
          </div>

          {/* 2. Tone Consistency Score Progress Bar */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Tone Consistency</span>
              <span className="text-xs font-semibold text-indigo-700">{metrics.toneConsistencyScore}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-slate-900">{metrics.toneConsistencyScore}%</div>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${toneBadge.color}`}>
                {toneBadge.label}
              </span>
            </div>
            {/* Tone progress bar */}
            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${metrics.toneConsistencyScore}%` }}
              />
            </div>
          </div>

          {/* 3. Readability Index */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Readability Grade</span>
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-sm font-semibold text-slate-500">Grade {metrics.readabilityBefore}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-base font-bold text-indigo-700">Grade {metrics.readabilityAfter}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {metrics.readabilityAfter > 12 ? 'Collegiate / Academic' : metrics.readabilityAfter > 9 ? 'Professional Standard' : 'Accessible Plain English'}
            </p>
          </div>

          {/* 4. Active Transformations Tally */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Linguistic Rules Fired</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {metrics.techniqueStats.synonymsReplaced +
                metrics.techniqueStats.wordClassShifts +
                metrics.techniqueStats.voiceConversions +
                metrics.techniqueStats.clausesReordered +
                metrics.techniqueStats.polarityToggles +
                metrics.techniqueStats.structureShifts}
              <span className="text-xs font-normal text-slate-500 ml-1">operations</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Across grammar & syntax layers
            </p>
          </div>
        </div>

        {/* Real-time Technique Breakdown Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium mr-1 text-[11px] uppercase tracking-wider">Techniques:</span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Synonyms: <strong className="ml-1">{metrics.techniqueStats.synonymsReplaced}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
            <Volume2 className="w-3 h-3 mr-1 text-blue-600" />
            Voice Conversions: <strong className="ml-1">{metrics.techniqueStats.voiceConversions}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[11px]">
            <GitFork className="w-3 h-3 mr-1 text-purple-600" />
            Word Class (Nominalizations): <strong className="ml-1">{metrics.techniqueStats.wordClassShifts}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
            <Shuffle className="w-3 h-3 mr-1 text-amber-600" />
            Clause Inversions: <strong className="ml-1">{metrics.techniqueStats.clausesReordered}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
            Affirmative/Negative: <strong className="ml-1">{metrics.techniqueStats.polarityToggles}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-1.5"></span>
            Syntax Structure: <strong className="ml-1">{metrics.techniqueStats.structureShifts}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
